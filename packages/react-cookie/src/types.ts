import {CookieSerializeOptions} from 'cookie';

export {CookieSerializeOptions};

export type CookieValue = {
  value: string;
} & CookieSerializeOptions;

export type Cookies = {[key: string]: CookieValue};
