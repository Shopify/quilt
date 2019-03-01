import * as React from 'react';
import {Manager} from './manager';

export const NetworkContext = React.createContext<Manager | undefined>(
  undefined,
);
