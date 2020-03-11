import {useEffect, useRef} from 'react';

type IntervalCallback = () => void;
type IntervalDelay = number | null;

// Adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks
// Also available at https://github.com/gaearon/overreacted.io/blob/master/src/pages/making-setinterval-declarative-with-react-hooks/index.md
//
// Copyright (c) 2020 Dan Abramov and the contributors.
//
export function useInterval(callback: IntervalCallback, delay: IntervalDelay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
