import React from 'react';
import {InstrumentManager} from './manager';

export const InstrumentContext = React.createContext<InstrumentManager | null>(
  null,
);
