# @afar/fetch

A tiny library that allows you to create a slightly customized version of `fetch`, in a chainable way.

The terminology used for this library is from train tracks - a **Tie** is a rectangular support for the rails in railroad tracks. It supports the rails.

I see what this library achieves as something similar to that - it helps build a solid _rail road_ for network calls on which requests go through and responses come back. This name also saves a (very) few bytes from the library `¯\_(ツ)_/¯`

This package is an es module.

## Install

```sh
npm i @afar/fetch
# OR
yarn add @afar/fetch
```

## Stats

## Use cases

I want to add a session ID to all calls I make through `fetch`.

```ts
import { start } from '@afar/fetch';
import { getSessionTie } from '@afar/fetch/ties/session';

const mySessionId = '...';

const fetchWithSession = start().tie(getSessionTie(mySessionId));
```

Actually, I want to add a bearer token to all calls I make instead.

```ts
import { getAuthTie } from '@afar/fetch/ties/auth';
import decode from 'jwt-decode'; // <- bring your own jwt decoder

async function getAuthToken() {
  // contains mechanism to get a new token.
  // the Tie bellow calls this only when token
  // about to expire in 30 seconds time.
}

const fetchWithAuth = start().tie(getAuthTie(getAuthToken, decode));
```

I now want to achieve both of the above

```ts
const fetchWithEverything = start()
  .tie(getSessionTie(mySessionId))
  .tie(getAuthTie(getAuthToken));
```

On top of that, I want to automatically retry on errors (by default retry on `429`, `500`, `502`, `503` and `504`)

```ts
import { getRetryTie } from '@afar/fetch/ties/retry';

const fetchPro = fetchWithEverything.tie(getRetryTie());
```

I want to write my own Tie

```ts
import type { Tie } from '@afar/fetch';

const addCorrelationIdTie: Tie = (req, fetcher, logger) => {
  req.headers.set('correlation-id', Math.random().toString());
  logger?.info?.('Correlation ID has been set'); // `start()` decides what `logger` will be.
  return fetcher(req);
};

function getHeaderTie(headers: Headers): Tie { //<- this is actually available at '@afar/fetch/ties/headers'
  return (req, fetcher) => {
    headers.forEach((value, key) => {
      req.headers.set(key, value);
    });

    return fetcher(req);
  };
}

const fetchUltra = fetchPro.tie(addCorrelationIdTie).tie(
  getHeaderTie(
    new Headers({
      'app-name': 'App Name',
      'content-type': 'application/json',
      'consistency-level': 'eventual',
    })
  )
);
```

I want to use `node-fetch` instead of either `window.fetch` or Node 18's in-built `fetch`.

```ts
import { fetch } from 'node-fetch';

const fetchBasic = start(fetch);
```

I want in-built Ties to log things into console

```ts
const fetchBasic = start(fetch, console)

// OR if you like to customize logging, 👇

const fetchBasic = start(undefined, {
  log: (...args: Parameters<Console['log']>) => console.log('[Tied-fetch]', ...args);
})
```
