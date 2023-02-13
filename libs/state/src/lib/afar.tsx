import {
  AsyncDispatch,
  AsyncReducer,
  StoreInterface,
} from './afar.types';

export function afar<S, A>(
  store: StoreInterface<S>,
  reducer: AsyncReducer<S, A>
) {
  const dispatch: AsyncDispatch<S, A> = async (action) => {
    const result = await reducer(store.getState, action, dispatch);

    if (result) {
      store.setState(result);
    }

    return store.getState();
  };

  return dispatch;
}
