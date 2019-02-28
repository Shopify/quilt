import {URL, URLSearchParams} from 'url';

declare global {
  namespace NodeJS {
    export interface Global {
      URL: typeof URL;
      URLSearchParams: typeof URLSearchParams;
    }
  }
}

global.URL = URL;
global.URLSearchParams = URLSearchParams;

export = null;
