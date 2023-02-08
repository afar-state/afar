import { AfarFetch } from './fetch';

describe('fetch', () => {
  it('should not crash', () => {
    const { fetch } = new AfarFetch();

    expect(fetch).toBeDefined();
  });
});
