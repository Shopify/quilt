import {useEffect, useRef} from 'react';
import {
  RequestIdleCallbackHandle,
  WindowWithRequestIdleCallback,
  UnsupportedBehavior,
} from './types';

export function useIdleCallback(
  callback: () => void,
  {unsupportedBehavior = UnsupportedBehavior.AnimationFrame} = {},
) {
  const handle = useRef<RequestIdleCallbackHandle | null>(null);

  useEffect(
    () => {
      if ('requestIdleCallback' in window) {
        handle.current = (window as WindowWithRequestIdleCallback).requestIdleCallback(
          () => callback(),
        );
      } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
        handle.current = window.requestAnimationFrame(() => {
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
          (window as WindowWithRequestIdleCallback).cancelIdleCallback(
            currentHandle,
          );
        } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
          window.cancelAnimationFrame(currentHandle);
        }
      };
    },
    [callback, unsupportedBehavior],
  );
}
