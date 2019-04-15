import * as React from 'react';

export default function useInterval(
  callback: () => void,
  delay: number,
  startImmediatly: boolean = false,
) {
  const [running, setRunning] = React.useState(startImmediatly);
  const [id, setId] = React.useState<NodeJS.Timer | null>(null);

  React.useEffect(
    () => {
      if (running) {
        setId(
          setInterval(() => {
            callback();
          }, delay),
        );
      }

      if (!running && id) {
        clearInterval(id);
      }

      return () => {
        if (id) {
          clearInterval(id);
          setId(null);
        }
      };
    },
    [running],
  );

  return {
    start: () => {
      setRunning(true);
    },
    stop: () => {
      setRunning(false);
    },
  };
}
