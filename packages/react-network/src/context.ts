import React from 'react';

import {NetworkManager} from './manager';

export const NetworkContext = React.createContext<NetworkManager | null>(null);
