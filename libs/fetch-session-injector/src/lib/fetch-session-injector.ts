import { AfarFetchTap } from '@afar/fetch';
import { nanoid } from 'nanoid';

function makeGetSession(key = '__afar_session') {
  return function getSession() {
    const existingSession = sessionStorage.getItem(key);
    if (existingSession) {
      return existingSession;
    } else {
      const newSession = nanoid();
      sessionStorage.setItem(key, newSession);
      return newSession;
    }
  };
}

export class AfarFetchSessionInjector implements AfarFetchTap {
  constructor(
    private sessionIdKey?: string,
    private sessionHeaderNames = ['session-id'],
    private getSession = makeGetSession(sessionIdKey)
  ) {}

  async requestTap(req: Request) {
    this.sessionHeaderNames.forEach((key) =>
      req.headers.set(key, this.getSession())
    );
    return req;
  }
}
