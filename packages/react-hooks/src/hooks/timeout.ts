import {useEffect, useRef} from 'react';

import {useIsomorphicLayoutEffect} from './isomorphic-layout-effect';

type IntervalCallback = () => void;
type IntervalDelay = number | null;

export function useTimeout(callback: IntervalCallback, delay: IntervalDelay) {
  const savedCallback = useRef(callback);

  // Need to use a layout effect to force the saved callback to be synchronously updated during a commit
  useIsomorphicLayoutEffect(() => {
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
