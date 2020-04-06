import {useEffect, useRef, useState} from 'react';

export const DELAY_COMMIT_SETTING_CHANGE = 500;

export function useDebouncedValue<T>(
  value: T,
  delay = DELAY_COMMIT_SETTING_CHANGE,
) {
  const [state, setState] = useState<T>(value);
  const updateRef = useRef<number>();

  useEffect(() => {
    if (updateRef.current) {
      window.clearTimeout(updateRef.current);
    }

    updateRef.current = window.setTimeout(() => {
      setState(value);
    }, delay);

    return () => {
      if (updateRef.current) {
        window.clearTimeout(updateRef.current);
      }
    };
  }, [value, delay]);

  return state;
}
