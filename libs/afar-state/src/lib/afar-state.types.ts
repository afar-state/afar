type Maybe<T> = T | null | undefined;
type MaybeReturn<T> = Maybe<T> | void;
type MaybePromise<T> = T | Promise<T>;

type Selector<S> = <T>(state: S) => T;

export type GetStateWithSelector<S> = () => S | Selector<S>;

export type AsyncDispatch<S, A> = (action: A) => Promise<S>;

export type AsyncReducer<S, A> = (
  getState: GetStateWithSelector<S>,
  action: A,
  dispatch: AsyncDispatch<S, A>
) => MaybeReturn<MaybePromise<Partial<S>>>;
