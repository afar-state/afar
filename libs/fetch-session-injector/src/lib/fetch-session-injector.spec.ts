import { AfarFetchSessionInjector } from './fetch-session-injector';

describe('fetchSessionInjector', () => {
  it('should work', () => {
    expect(new AfarFetchSessionInjector().requestTap).toBeDefined();
  });
});
