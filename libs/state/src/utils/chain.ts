import { AsyncDispatch, AsyncReducer, GetStateWithSelector } from '../lib/afar.types';

export function chain<S, A>(
  reducerSoFar?: AsyncReducer<S, A>,
  nextPartial?: AsyncReducer<S, A>
) {
  function reducer(
    getState: GetStateWithSelector<S>,
    action: A,
    dispatch: AsyncDispatch<S, A>
  ) {
    const newState = reducerSoFar?.(getState, action, dispatch);
    if (newState) return newState;
    return nextPartial?.(getState, action, dispatch);
  }

  function link(fn: AsyncReducer<S, A>) {
    return chain(reducerSoFar, fn);
  }

  reducer.link = link;

  return reducer;
}
