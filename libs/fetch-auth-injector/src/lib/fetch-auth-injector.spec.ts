import { FetchAuthInjector } from './fetch-auth-injector';

describe('fetchAuthInjector', () => {
  it('should work', () => {
    expect(new FetchAuthInjector().requestTap).toBeDefined();
  });
});
