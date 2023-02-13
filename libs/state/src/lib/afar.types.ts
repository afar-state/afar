type Maybe<T> = T | null | undefined;
type MaybeReturn<T> = Maybe<T> | void;
type MaybePromise<T> = T | Promise<T>;

export type Selector<S> = <T>(state: S) => T;

export interface GetStateWithSelector<S> {
  (): S;
  <T>(selector: (state: S) => T): T;
}

export type AsyncDispatch<S, A> = (action: A) => Promise<S>;

export type AsyncReducer<S, A> = (
  getState: GetStateWithSelector<S>,
  action: A,
  dispatch: AsyncDispatch<S, A>
) => MaybeReturn<MaybePromise<Maybe<Partial<S>>>>;

export type StoreInterface<S> = {
  getState: GetStateWithSelector<S>;
  setState: (state: S | Partial<S>) => void;
} & StoreHook<S>;

export type StoreHook<S> = {
  (): S;
  <T>(selector: (state: S) => T): T;
};
