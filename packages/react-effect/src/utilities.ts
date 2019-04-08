import {ComponentType} from 'react';

export function restrictToServer<T extends ComponentType<any>>(
  Component: T,
): T {
  if (typeof window !== 'undefined') {
    const NoopComponent: T = (() => null) as any;
    NoopComponent.displayName = Component.displayName || Component.name;
    return NoopComponent;
  }

  return Component;
}
