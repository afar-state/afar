import { create } from 'zustand';
import { AsyncDispatch, AsyncReducer, GetStateWithSelector } from './afar-state.types';

function identity<T>(x: T): T {
  return x;
}

export function afar<S, A>(initialState: S, reducer: AsyncReducer<S, A>) {
  const api = create(() => initialState);

  const getState: GetStateWithSelector<S> = (selector = identity) => {
    return selector(api.getState());
  }

  const dispatch: AsyncDispatch<S, A> = async (action) => {
    const result = await reducer(getState, action, dispatch);

    if (result) {
      api.setState(result);
    }

    return api.getState();
  }

  return {
    dispatch,
    useStore: api,
  }
}
