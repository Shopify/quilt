import {useEffect, useState, useRef} from 'react';

interface DebouncedOptions {
  timeoutMs: number;
}

const DEFAULT_DELAY = 500;

export function useDebouncedValue<T>(
  value: T,
  {timeoutMs}: DebouncedOptions = {timeoutMs: DEFAULT_DELAY},
) {
  const [state, setState] = useState<T>(value);
  const stateRef = useRef<T>(state);

  useEffect(() => {
    if (stateRef.current === value) {
      return;
    }

    const timeout = setTimeout(() => {
      stateRef.current = value;
      setState(value);
    }, timeoutMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, timeoutMs]);

  return state;
}
