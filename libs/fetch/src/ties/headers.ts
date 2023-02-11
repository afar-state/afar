import { Tie } from "../lib/fetch";

export function getHeaderTie(headers: Headers): Tie {
  return (req, fetcher) => {
    headers.forEach((value, key) => {
      req.headers.set(key, value);
    });

    return fetcher(req);
  };
}
