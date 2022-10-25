import {useState, useCallback} from 'react';

type ToggleReturn = {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
} & [boolean, () => void, () => void, () => void];

/**
 * Returns a stateful value, and a set of memoized functions to toggle it,
 * set it to true and set it to false.
 *
 * @param {boolean} initialState initial value state.
 * @return [value, setTrue, setFalse, toggle] or {value, setTrue, setFalse, toggle}.
 */
export function useToggle(initialState: boolean) {
  const [value, setState] = useState(initialState);

  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  const toggle = useCallback(() => setState((state) => !state), []);

  const ret = [value, setTrue, setFalse, toggle] as ToggleReturn;
  ret.value = value;
  ret.setTrue = setTrue;
  ret.setFalse = setFalse;
  ret.toggle = toggle;

  return ret;
}
