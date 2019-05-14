import {createContext} from 'react';
import {HydrationManager} from './manager';

export const HydrationContext = createContext<HydrationManager>(
  new HydrationManager(),
);
