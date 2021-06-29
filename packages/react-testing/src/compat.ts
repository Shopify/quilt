import {ReactInstance, Fiber} from './types';

export function getInternals(instance: ReactInstance): Fiber {
  // In React 17+ _reactInternalFiber was renamed to _reactInternals. As such we need to handle both APIs to maintain support.

  if ('_reactInternalFiber' in instance) {
    return instance._reactInternalFiber;
  }

  return instance._reactInternals;
}
