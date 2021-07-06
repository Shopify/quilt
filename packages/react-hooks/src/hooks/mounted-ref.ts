import {useRef} from 'react';

import {useIsomorphicLayoutEffect} from './isomorphic-layout-effect';


export function useMountedRef() {
  const mounted = useRef(true);

  useIsomorphicLayoutEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
