import ReactDOM from 'react-dom';
import type {Root as ReactRoot} from 'react-dom/client';

import {ReactInstance, Fiber} from './types';

export function getInternals(instance: ReactInstance): Fiber {
  // In React 17+ _reactInternalFiber was renamed to _reactInternals. As such we need to handle both APIs to maintain support.

  if ('_reactInternalFiber' in instance) {
    return instance._reactInternalFiber;
  }

  return instance._reactInternals;
}

/** Shim to provide createRoot backwards compatibility for React < 18 */
function createRootShim(element: HTMLElement): ReactRoot {
  return {
    render(children: React.ReactChild | Iterable<React.ReactNode>): void {
      ReactDOM.render(children as any, element as any);
    },
    unmount(): void {
      ReactDOM.unmountComponentAtNode(element as any);
    },
  };
}

/** Uses React >= 18 createRoot if available or falls back to shim*/
export function createRoot(element: HTMLElement): ReactRoot {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-dom/client').createRoot(element);
  } catch {
    return createRootShim(element);
  }
}
