export type RequestFetcher = (req: Request) => Promise<Response>;
export type PartialConsole = Partial<Pick<Console, 'log' | 'info' | 'warn' | 'error'>>

export interface Pipe {
  (req: Request, last: RequestFetcher, logger?: PartialConsole): Promise<Response>
  name?: string;
}

export interface FetchPiper {
  (input: RequestInfo, init?: RequestInit): Promise<Response>;
  pipe: (pipe: Pipe) => FetchPiper;
  logger?: PartialConsole;
}

function startFetchPipe(fetcher: RequestFetcher = fetch, logger?: PartialConsole, pipeFn?: Pipe) {
  function _fetch(input: RequestInfo, init?: RequestInit) {
    const req = new Request(input, init);

    if(pipeFn) {
      return pipeFn(req, fetcher, logger)
    }

    return fetcher(req)
  }

  function pipe(pipe: Pipe) {
    return startFetchPipe(_fetch, logger, pipe);
  }

  _fetch.pipe = pipe;
  _fetch.logger = logger;

  return _fetch
}

export const startPipe = startFetchPipe as (fetcher?: RequestFetcher, logger?: PartialConsole) => FetchPiper;
