import {useEffect, useState} from 'react';

export function useDelayedCallback(callback: Function, delay: number) {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function callbackWithDelay() {
    const callbackId = setTimeout(() => {
      callback();
      setTimeoutId(undefined);
    }, delay);

    setTimeoutId(callbackId);
  }

  return callbackWithDelay;
}
