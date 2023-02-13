export const enum Phase {
  Ready,
  Run,
  Done,
  Fail,
  Rerun,
}

export type ReadyPhase = {
  phase: Phase.Ready;
};

export type RunPhase<I> = {
  phase: Phase.Run;
  input: I;
  calls: number;
};

export type DonePhase<I, D> = {
  phase: Phase.Done;
  data: D;
  input: I;
  calls: number;
};

export type FailPhase<I, E> = {
  phase: Phase.Fail;
  error: E;
  input: I;
  calls: number;
};

export type RerunPhase<I, D, E> = {
  phase: Phase.Rerun;
  input: I;
  data?: D;
  error?: E;
  calls: number;
};

export type SettledPhasor<I, D, E> = DonePhase<I, D> | FailPhase<I, E>;
export type RunningPhasor<I, D, E> = RunPhase<I> | RerunPhase<I, D, E>;

export type Phasor<I, D, E> =
  | ReadyPhase
  | RunningPhasor<I, D, E>
  | SettledPhasor<I, D, E>;
