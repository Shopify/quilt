import {useEffect, useRef} from 'react';

type IntervalCallback = () => void;
type IntervalDelay = number | null;

export function useTimeout(callback: IntervalCallback, delay: IntervalDelay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}
