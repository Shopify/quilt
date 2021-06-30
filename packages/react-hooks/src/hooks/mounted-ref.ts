import {useRef, useLayoutEffect} from 'react';

export function useMountedRef() {
  const mounted = useRef(true);

  useLayoutEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
