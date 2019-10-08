import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';
import {Performance as PerformanceManager} from '@shopify/performance';

import {PerformanceContext} from './context';

import {isServer} from './utilities';

export function PerformanceProvider({
  children = null,
}: {
  children?: React.ReactNode;
}) {
  const performance = useLazyRef(() => {
    if (isServer()) {
      return;
    }
    return new PerformanceManager();
  });

  return (
    <PerformanceContext.Provider value={performance.current}>
      {children}
    </PerformanceContext.Provider>
  );
}
