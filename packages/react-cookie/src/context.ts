import React from 'react';
import {CookieManager} from './manager';
import {UniversalCookies} from './UniversalCookies';

export const CookieContext = React.createContext<
  CookieManager | UniversalCookies | null | any
>(null);
