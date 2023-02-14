import { Phasor } from '../phasor/phasor.types';

export type Literal<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

export type RunPhasor<N extends string, I> = {
  type: `${Literal<N>}/run`;
  payload: I;
};

export type RerunPhasor<N extends string, I> = {
  type: `${Literal<N>}/rerun`;
  payload: I;
};

export type PhasorActions<N extends string, I> =
  | RunPhasor<N, I>
  | RerunPhasor<N, I>;

export type SetPhasor<N extends string, I, D, E> = {
  type: `${Literal<N>}/__set`;
  payload: Phasor<I, D, E>;
};

export type PhasorActionsTotal<N extends string, I, D, E> =
  | PhasorActions<N, I>
  | SetPhasor<N, I, D, E>;

export type PhasorState<N extends string, I, D, E> = {
  [name in Literal<N>]: Phasor<I, D, E>
};

export type PhasorStateActions<P> = P extends PhasorState<infer N, infer I, infer D, infer E> ? PhasorActionsTotal<N, I, D, E> : never;
