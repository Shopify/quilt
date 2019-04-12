import * as React from 'react';

export default function useTimeout(callback, delay: number) {
  const callbackRef = React.useRef<() => void>();

  React.useEffect(
    () => {
      callbackRef.current = callback;
    },
    [callback],
  );
  React.useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      function tick() {
        if (callbackRef.current) {
          callbackRef.current();
        }
      }
      if (delay !== null) {
        // eslint-disable-next-line prefer-const
        let id = setTimeout(tick, delay);

        return () => clearTimeout(id);
      }
    },
    [delay],
  );
}
