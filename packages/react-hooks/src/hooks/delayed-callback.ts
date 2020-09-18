import {useEffect, useRef} from 'react';

export function useDelayedCallback(callback: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function callbackWithDelay() {
    const timeoutId = setTimeout(() => {
      callback();
      timeoutRef.current = undefined;
    }, delay);

    timeoutRef.current = timeoutId;
  }

  return callbackWithDelay;
}
