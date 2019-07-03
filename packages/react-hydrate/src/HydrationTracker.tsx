import * as React from 'react';
import {useHydrationManager} from './hooks';

export function HydrationTracker() {
  const manager = useHydrationManager();

  React.useEffect(
    () => {
      manager.hydrated = true;
    },
    [manager],
  );

  return null;
}
