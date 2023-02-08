import type { AfarFetchTap } from "@afar/fetch";
import jwt_decode from "jwt-decode";

export class FetchAuthInjector implements AfarFetchTap {

  constructor(private getAuthToken?: () => Promise<string>, private _existingToken?: string) {}

  async requestTap(req: Request) {
    if (this.getAuthToken) {
      if(this._existingToken) {
        const decodedToken = jwt_decode<{exp: number}>(this._existingToken);
        if(decodedToken.exp < ((Date.now() / 1000) - 30)) {
          return req;
        }
      }

      this._existingToken = await this.getAuthToken();
      req.headers.set('Authorization', `Bearer ${this._existingToken}`);
    }

    return req;
  }
}
