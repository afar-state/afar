import type { PartialConsole, Pipe } from '../lib/fetch';
import decode from 'jwt-decode';

type StringKeys<T> = keyof {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

export type TokenKey = StringKeys<URL>;
export type TokenGetter = () => Promise<string | undefined>;

const tokenStore = new Map<string, string>();

export function getAuthPipe(
  getAuthToken: TokenGetter,
  tokenKeyFromUrl: TokenKey = 'origin'
): Pipe {
  return async (req, fetcher, logger) => {
    const tokenKey = new URL(req.url)[tokenKeyFromUrl];
    try {
      const token = await getTokenMemoized(tokenKey, getAuthToken, logger);
      if (token) req.headers.set('Authorization', `Bearer ${token}`);
      // eslint-disable-next-line no-empty
    } finally {
    }

    return fetcher(req);
  };
}

async function getTokenMemoized(
  key: string,
  getAuthToken: TokenGetter,
  logger?: PartialConsole
) {
  let token: string | undefined = tokenStore.get(key);

  if (token) {
    const decoded = decode<{ exp?: number }>(token);
    if (decoded?.exp && decoded.exp < Date.now() / 1000 - 30) {
      tokenStore.delete(key);
      logger?.info?.(
        `Token expired for ${key}. Attempting to fetch a new token.`
      );
    } else {
      return token;
    }
  }

  try {
    token = await getAuthToken();

    if (token) {
      tokenStore.set(key, token);
      logger?.info?.(`New token fetched successfully for ${key}.`);
    }
  } catch (error) {
    logger?.error?.(
      `Error while getting auth token for ${key} - ${(error as Error).message}`
    );
  }

  return token;
}
