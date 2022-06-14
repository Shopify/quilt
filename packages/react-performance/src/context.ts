import React from 'react';
import {Performance} from '@shopify/performance';

export const PerformanceContext = React.createContext<Performance | null>(
  typeof document === 'undefined' ? null : new Performance(),
);
