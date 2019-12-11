import {useState, useCallback} from 'react';

/**
 * Returns a stateful value, and a set of memoized functions to toggle it,
 * force it to true and force it to false
 */
export function useForcibleToggle(initialState: boolean) {
  const [state, setState] = useState(initialState);

  const toggles = {
    toggle: useCallback(() => setState(state => !state), []),
    forceTrue: useCallback(() => setState(true), []),
    forceFalse: useCallback(() => setState(false), []),
  };

  // cast needed to say this returns a two item array with the items in
  // their specific positions instead of `(typeof state | typeof toggles)[]`
  return [state, toggles] as [typeof state, typeof toggles];
}
