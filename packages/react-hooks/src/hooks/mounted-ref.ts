import {useRef} from 'react';

import {useIsomorphicLayoutEffect} from './isomorphic-layout-effect';

export function useMountedRef() {
  const mounted = useRef(true);

  useIsomorphicLayoutEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
