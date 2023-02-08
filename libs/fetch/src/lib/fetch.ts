import { AfarFetchTap, MiniConsole } from './fetch.types';

export class AfarFetch {
  constructor(
    private plugins: AfarFetchTap[] = [],
    public fetcher = window.fetch,
    public logger: MiniConsole = window.console
  ) {
    this.plugins.forEach(plugin => plugin.logger = logger)
  }

  async fetch(info: RequestInfo, init?: RequestInit) {
    let request = new Request(info, init);
    for (const plugin of this.plugins) {
      if (plugin.requestTap) {
        request = await plugin.requestTap(request, this);
      }
    }

    try {
      let response = await this.fetcher(request);
      for (const plugin of this.plugins) {
        if (plugin.responseTap) {
          response = await plugin.responseTap(request, response, this);
        }
      }

      return response;
    } catch (error) {
      for (const plugin of this.plugins) {
        if (plugin.onError) {
          plugin.onError(error, request);
        }
      }

      throw error;
    }
  }
}
