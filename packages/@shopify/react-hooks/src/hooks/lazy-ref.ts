import {useRef, MutableRefObject} from 'react';

const UNSET = Symbol('unset');

export function useLazyRef<T>(getValue: () => T): MutableRefObject<T> {
  const ref = useRef<T | typeof UNSET>(UNSET);

  if (ref.current === UNSET) {
    ref.current = getValue();
  }

  return ref as MutableRefObject<T>;
}
