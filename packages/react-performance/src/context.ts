import React from 'react';
import {Performance} from '@shopify/performance';

export const PerformanceContext = React.createContext<Performance | null>(
  typeof window === 'undefined' ? null : new Performance(),
);
