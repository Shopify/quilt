import {CookieSerializeOptions} from 'cookie';

export {CookieSerializeOptions};

export type CookieValue = {
  value: string;
} & CookieSerializeOptions;

export type Cookie = {[key: string]: CookieValue};

export interface CookieManager {
  getCookie(name: string): string | undefined;
  getCookies(): Cookie;
  setCookie(name: string, value: string | CookieValue): void;
  removeCookie(name: string): void;
}
