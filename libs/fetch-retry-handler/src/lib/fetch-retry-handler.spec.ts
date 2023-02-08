import { AfarFetchRetryHandler } from './fetch-retry-handler';

describe('fetchRetryHandler', () => {
  it('should work', () => {
    const plugin = new AfarFetchRetryHandler();
    expect(plugin.responseTap).toBeDefined;
  });
});
