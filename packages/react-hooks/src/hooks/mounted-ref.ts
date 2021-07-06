import {useRef, useEffect} from 'react';

export function useMountedRef() {
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
