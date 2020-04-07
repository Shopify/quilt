import {useEffect, useState} from 'react';

interface DebouncedOptions {
  timeoutMs: number;
}

const DEFAULT_DELAY = 500;

export function useDebouncedValue<T>(
  value: T,
  {timeoutMs}: DebouncedOptions = {timeoutMs: DEFAULT_DELAY},
) {
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setState(value);
    }, timeoutMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value, timeoutMs]);

  return state;
}
