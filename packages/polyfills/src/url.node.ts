import {URL, URLSearchParams} from 'url';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface Global {
      URL: typeof URL;
      URLSearchParams: typeof URLSearchParams;
    }
  }
}

global.URL = URL;
global.URLSearchParams = URLSearchParams;
