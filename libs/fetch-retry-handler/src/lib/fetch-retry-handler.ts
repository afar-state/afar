import type { AfarFetch, AfarFetchTap } from '@afar/fetch';

export class AfarFetchRetryHandler implements AfarFetchTap {
  constructor(
    private maxRetries = 3,
    private minDelay = 500,
    private retryableStatuses = [408, 429, 500, 502, 503, 504]
  ) {}

  private _retryMap = new WeakMap<Request, number>();

  private _waitFor(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async responseTap(
    req: Request,
    res: Response,
    afarFetch: AfarFetch
  ): Promise<Response> {
    if (!res.ok && !this.retryableStatuses.includes(res.status)) {
      const retries = this._retryMap.get(req) || 0;

      if (retries <= this.maxRetries) {
        await this._waitFor(this.minDelay * Math.exp(retries));
        const newRes = await afarFetch.fetcher(req);
        this._retryMap.set(req, retries + 1);

        return this.responseTap(req, newRes, afarFetch);
      } else {
        return res;
      }
    }

    return res;
  }
}
