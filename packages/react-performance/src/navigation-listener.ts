import {Navigation} from '@shopify/performance';

import {usePerformanceEffect} from './performance-effect';

export interface NavigationListener {
  (navigation: Navigation): void;
}

export function useNavigationListener(listener: NavigationListener) {
  usePerformanceEffect(performance => performance.on('navigation', listener));
}
