import {
  AfarReturn,
  AsyncDispatch,
  AsyncReducer,
  GetStateWithSelector,
  StoreInterface,
} from './afar.types';

function identity<T>(x: T): T {
  return x;
}

export function afar<S, A>(
  store: StoreInterface<S>,
  reducer: AsyncReducer<S, A>
): AfarReturn<S, A> {
  const getState: GetStateWithSelector<S> = (selector = identity) => {
    return selector(store.getState());
  };

  const dispatch: AsyncDispatch<S, A> = async (action) => {
    const result = await reducer(getState, action, dispatch);

    if (result) {
      store.setState(result);
    }

    return store.getState();
  };

  return {
    dispatch,
    useStore: store,
  };
}
