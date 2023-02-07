import {useEffect, useRef} from 'react';

import {RequestIdleCallbackHandle, UnsupportedBehavior} from './types';

export function useIdleCallback(
  callback: () => void,
  {unsupportedBehavior = UnsupportedBehavior.AnimationFrame} = {},
) {
  const handle = useRef<RequestIdleCallbackHandle | null>(null);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      handle.current = window.requestIdleCallback(() => callback());
    } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
      handle.current = (window as Window).requestAnimationFrame(() => {
        callback();
      });
    } else {
      callback();
    }

    return () => {
      const {current: currentHandle} = handle;
      handle.current = null;

      if (currentHandle == null) {
        return;
      }

      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(currentHandle);
      } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
        (window as Window).cancelAnimationFrame(currentHandle);
      }
    };
  }, [callback, unsupportedBehavior]);
}
