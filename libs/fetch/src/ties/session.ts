import type { Tie } from '../lib/fetch';

export type HybridSessionIdGetter =
  | (() => string | undefined | Promise<string | undefined>)
  | string
  | undefined;

let sessionId: string | undefined;
const defaultSessionId = crypto.randomUUID();

function getter(getterArg: HybridSessionIdGetter) {
  if (typeof getterArg === 'function') {
    return getterArg();
  }
  return getterArg;
}

export function getSessionTie(
  getterArg: HybridSessionIdGetter,
  headerName = 'session-id'
): Tie {
  return async (req, fetcher) => {
    if (!sessionId) sessionId = (await getter(getterArg)) || defaultSessionId;
    req.headers.set(headerName, sessionId);
    return fetcher(req);
  };
}
