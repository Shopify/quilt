import {useContext, useEffect} from 'react';
import {Performance} from '@shopify/performance';

import {PerformanceContext} from './context';

export interface PerformanceEffectCallback {
  (performance: Performance): VoidFunction | void;
}

export function usePerformanceEffect(
  callback: PerformanceEffectCallback,
  dependencies: unknown[] = [],
) {
  const performance = useContext(PerformanceContext);

  useEffect(() => {
    if (performance == null) {
      return;
    }

    const cleanup = callback(performance);

    if (cleanup) {
      return cleanup;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performance, ...dependencies]);
}
