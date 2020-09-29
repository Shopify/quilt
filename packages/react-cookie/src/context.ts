import React from 'react';

import {CookieManager} from './types';

export const CookieContext = React.createContext<CookieManager | null>(null);
