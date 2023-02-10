# @afar/fetch

A tiny library that allows you to create a slightly customized version of `fetch`, in a pipe-able way.

This package is an `esmodule`.

## Use cases

I want to add a session ID to all calls I get through `fetch`.

```ts
import { startPipe } from '@afar/fetch';
import { getSessionPipe } from '@afar/fetch/pipes/session';

const mySessionId = '...';

const fetchWithSession = startPipe().pipe(getSessionPipe(mySessionId));
```

Actually, I want to add a bearer token to all calls I get instead.

```ts
// Note -> this pipe (alone) needs the jwt-decode package as a peerDependency.
import { getAuthPipe } from '@afar/fetch/pipes/auth';

async function getAuthToken() {
  // contains mechanism to refresh an expired token
}

const fetchWithAuth = startPipe().pipe(getAuthPipe(getAuthToken));
```

I now want to achieve both of the above

```ts
const fetchWithEverything = startPipe()
  .pipe(getSessionPipe(mySessionId))
  .pipe(getAuthPipe(getAuthToken));
```

On top of that, I want to automatically retry on errors (by default retry on `429`, `500`, `502`, `503` and `504`)

```ts
import { getRetryPipe } from '@afar/fetch/pipes/retry';

const fetchPro = fetchWithEverything.pipe(getRetryPipe());
```

I want to write my own pipe

```ts
import type { Pipe } from '@afar/fetch';

const addCorrelationIdPipe: Pipe = (req, fetcher, logger) => {
  req.headers.set('correlation-id', Math.random().toString());
  logger?.info('Correlation ID has been set'); // `startPipe()` decides what `logger` will be.
  return fetcher(req);
};

function getHeaderPipe(headers: Headers): Pipe {
  return (req, fetcher) => {
    headers.forEach((value, key) => {
      req.headers.set(key, value);
    });

    return fetcher(req);
  };
}

const fetchUltra = fetchPro.pipe(addCorrelationIdPipe).pipe(
  getHeaderPipe(
    new Headers({
      'app-name': 'App Name',
      'content-type': 'application/json',
      'consistency-level': 'eventual',
    })
  )
);
```

I want to use `node-fetch` instead of `window.fetch` or Node 18's in-built `fetch`.

```ts
import { fetch } from 'node-fetch';

const fetchBasic = startPipe(fetch);
```

I want in-built pipes to log things into console

```ts
const fetchBasic = startPipe(fetch, console)

// OR if you like to customize logging, 👇

const fetchBasic = startPipe(undefined, {
  log: (...args: Parameters<Console['log']>) => console.log('[piped-fetch]', ...args);
})
```

```ts
import { startPipe } from '@afar/fetch';
import { getSessionPipe } from '@afar/fetch/pipes/session';
import { getAuthPipe } from '@afar/fetch/pipes/auth';
import { getRetryPipe } from '@afar/fetch/pipes/retry';

const myFetch = startPipe()
  .pipe(getSessionPipe(mySessionId))
  .pipe(getAuthPipe(getAuthToken))
  .pipe(getRetryPipe());

myFetch('https://...')
  .then((res) => res.json())
  .catch(console.error);
```
