import * as React from 'react';
import {Manager, noopManager} from './manager';

export const AsyncContext = React.createContext<Manager>(noopManager);
