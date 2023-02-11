import type { Tie } from "../lib/fetch";

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const retryStatuses = [429, 500, 502, 503, 504];

export function defaultGetRetryTimeout(res: Response, retries: number, maxRetries = 5) {
  if (!res.ok && retryStatuses.includes(res.status) && retries < maxRetries) {
    const retryAfter = res.headers.get('retry-after');
    if (retryAfter) {
      return parseInt(retryAfter, 10) * 1000;
    }

    return 500 * Math.pow(2, retries);
  }

  return null;
}

export function getRetryTie(
  getRetryTimeout = defaultGetRetryTimeout
): Tie {
  return async (req, fetcher, logger) => {
    let retries = 0;
    let res = await fetcher(req);

    let retryIn: number | null;
    // eslint-disable-next-line no-cond-assign
    while ((retryIn = getRetryTimeout(res, retries++))) {
      await waitFor(retryIn);
      res = await fetcher(req);
    }

    if (!res.ok) {
      logger?.error?.(
        `Request to ${new URL(req.url).host} failed after ${retries} retries.`
      );
    }

    return res;
  };
}
