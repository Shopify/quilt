import {useContext} from 'react';
import {HydrationContext} from './context';

export function useHydrationManager() {
  return useContext(HydrationContext);
}
