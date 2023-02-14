import { AsyncDispatch, AsyncReducer } from '../../lib/afar.types';
import { asyncToPhasor } from '../phasor/phasor';
import { Literal, PhasorActions, PhasorState } from './phasor.state.types';
import { Phase } from '../phasor/phasor.types';

function run<I extends unknown[], D, E>(
  name: string,
  fn: (...args: I) => Promise<D>,
  args: I
) {
  return asyncToPhasor<I, D, E>(fn, (phasor) => {
    run.dispatch?.({
      type: `${name}/__set`,
      payload: phasor,
    });
  }).run(...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
run.dispatch = undefined as AsyncDispatch<any, any> | undefined;

export function toPhasor<
  N extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PhasorInputs extends any[],
  PhasorData,
  PhasorError
>(name: Literal<N>, fn: (...args: PhasorInputs) => Promise<PhasorData>) {
  type Name = Literal<N>;
  type State = PhasorState<N, PhasorInputs, PhasorData, PhasorError>;
  type Actions = PhasorActions<Name, PhasorInputs>;

  const initial = {
    [name]: {
      phase: Phase.Ready,
    },
  } as State;

  const reducer: AsyncReducer<State, Actions> = async (_, action, dispatch) => {
    // `dispatch` never changes reference, so it is ok to do this only once.
    if (!run.dispatch) run.dispatch = dispatch;

    const actionParts = action.type.split('/');

    if (actionParts.length > 1 && actionParts[0].startsWith(name)) {
      // Now this reducer is relevant to this phasor.

      switch (action.type) {
        case `${name}/run`:
        case `${name}/rerun`: {
          return {
            [name]: await run(name, fn, action.payload),
          } as State;
        }
      }
    }
  };

  return {
    initial,
    reducer,
  };
}
