import type { AfarFetch } from "./fetch";

export type RequestMod = (req: Request, afarFetch: AfarFetch) => Promise<Request> | Request;
export type ResponseMod = (req: Request, res: Response, afarFetch: AfarFetch) => Promise<Response> | Response;
export type MiniConsole = Pick<Console, 'log' | 'info' | 'error'>;

export interface AfarFetchTap {
  requestTap?: RequestMod;
  responseTap?: ResponseMod;
  onError?: (err: unknown, request: Request) => void;
  logger?: MiniConsole;
}
