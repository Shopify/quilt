import React from 'react';

import type {CookieManager} from './types';

export const CookieContext = React.createContext<CookieManager | null>(null);
