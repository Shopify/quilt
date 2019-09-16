import React from 'react';
import {CookieManager} from './manager';

export const CookieContext = React.createContext<CookieManager | null>(null);
