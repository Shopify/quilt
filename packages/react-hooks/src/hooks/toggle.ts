import {useState, useCallback} from 'react';

export function useToggle(initialState: boolean) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(state => !state), []);

  // cast needed to say this returns a two item array with the items in
  // their specific positions instead of `(typeof state | typeof toggle)[]`
  return [state, toggle] as [typeof state, typeof toggle];
}
