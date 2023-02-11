export type RequestFetcher = (req: Request) => Promise<Response>;
export type PartialConsole = Partial<Pick<Console, 'log' | 'info' | 'warn' | 'error'>>

export interface Tie {
  (req: Request, last: RequestFetcher, logger?: PartialConsole): Promise<Response>
  name?: string;
}

export interface FetchRail {
  (input: RequestInfo, init?: RequestInit): Promise<Response>;
  tie: (tie: Tie) => FetchRail;
  logger?: PartialConsole;
}

function _start(fetcher: RequestFetcher = fetch, logger?: PartialConsole, tieFn?: Tie) {
  function _fetch(input: RequestInfo, init?: RequestInit) {
    const req = new Request(input, init);

    if(tieFn) {
      return tieFn(req, fetcher, logger)
    }

    return fetcher(req)
  }

  function tie(tie: Tie) {
    return _start(_fetch, logger, tie);
  }

  _fetch.tie = tie;
  _fetch.logger = logger;

  return _fetch
}

export const start = _start as (fetcher?: RequestFetcher, logger?: PartialConsole) => FetchRail;
