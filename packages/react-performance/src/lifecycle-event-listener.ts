import {LifecycleEvent} from '@shopify/performance';

import {usePerformanceEffect} from './performance-effect';

export interface LifecycleEventListener {
  (event: LifecycleEvent): void;
}

export function useLifecycleEventListener(listener: LifecycleEventListener) {
  usePerformanceEffect(performance =>
    performance.on('lifecycleEvent', listener),
  );
}
