import * as React from 'react';

export interface Props {
  onToggle: (...args: any[]) => any;
  deferred?: boolean;
}

export interface State {
  active: boolean;
}

const DEFERRED_TIMEOUT = 100;

export function Toggle({onToggle, deferred}: Props) {
  const [active, setActive] = React.useState(true);
  const statusMarkup = active ? 'active' : 'inactive';

  const handleClick = React.useCallback(
    () => {
      if (deferred) {
        return new Promise(resolve => {
          setTimeout(() => {
            setActive(!active);
            onToggle();
            resolve();
          }, DEFERRED_TIMEOUT);
        });
      }
      setActive(!active);
      onToggle();
      return Promise.resolve();
    },
    [active, deferred, onToggle],
  );

  return (
    <button type="button" onClick={handleClick}>
      {statusMarkup}
    </button>
  );
}
