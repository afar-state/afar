import {
  DonePhase,
  FailPhase,
  Phase,
  Phasor,
  ReadyPhase,
  RerunPhase,
  RunPhase,
} from './phasor.types';

function atReady<I, D, E>(phasor: Phasor<I, D, E>): phasor is ReadyPhase {
  return phasor.phase === Phase.Ready;
}

function atRun<I, D, E>(phasor: Phasor<I, D, E>): phasor is RunPhase<I> {
  return phasor.phase === Phase.Run;
}

function atDone<I, D, E>(phasor: Phasor<I, D, E>): phasor is DonePhase<I, D> {
  return phasor.phase === Phase.Done;
}

function atFail<I, D, E>(phasor: Phasor<I, D, E>): phasor is FailPhase<I, E> {
  return phasor.phase === Phase.Fail;
}

function atRerun<I, D, E>(
  phasor: Phasor<I, D, E>
): phasor is RerunPhase<I, D, E> {
  return phasor.phase === Phase.Rerun;
}

function onGoing<I, D, E>(
  phasor: Phasor<I, D, E>
): phasor is RunPhase<I> | RerunPhase<I, D, E> {
  return atRun(phasor) || atRerun(phasor);
}

function settled<I, D, E>(
  phasor: Phasor<I, D, E>
): phasor is DonePhase<I, D> | FailPhase<I, E> {
  return atDone(phasor) || atFail(phasor);
}

export const isPhasor = {
  atReady,
  atRun,
  atDone,
  atFail,
  atRerun,
  onGoing,
  settled,
};

export function asyncToPhasor<I extends unknown[], D, E>(
  fn: (...args: I) => Promise<D>,
  onChange: (phasor: Phasor<I, D, E>) => void
) {
  let phasor: Phasor<I, D, E> = { phase: Phase.Ready };

  function _onChange(_phasor: Partial<Phasor<I, D, E>>) {
    phasor = _phasor as Phasor<I, D, E>;
    if (atRun(phasor)) phasor.calls = 0;
    if (atRerun(phasor)) phasor.calls++;
    onChange(phasor);
  }

  async function run(...input: I) {
    if (settled(phasor)) {
      _onChange({
        phase: Phase.Rerun,
        input,
      });
    } else if (atReady(phasor)) {
      _onChange({
        phase: Phase.Run,
        input: input,
      });
    } else {
      return phasor;
    }

    try {
      const data = await fn(...input);

      _onChange({
        phase: Phase.Done,
        input: input,
        data,
      });
    } catch (error) {
      _onChange({
        phase: Phase.Fail,
        input: input,
        error: error as E,
      });
    }

    return phasor;
  }

  return { run };
}
