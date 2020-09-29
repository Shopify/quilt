import React from 'react';

export interface Props {
  onToggle: (...args: any[]) => any;
  deferred?: boolean;
}

export enum Status {
  Active,
  Inactive,
  InTransition,
}

export interface State {
  active: boolean;
}

const DEFERRED_TIMEOUT = 100;

export function Toggle({onToggle, deferred}: Props) {
  const [status, setStatus] = React.useState(Status.Active);

  const handleClick = React.useCallback(() => {
    setStatus(Status.InTransition);

    if (deferred) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(onToggle());
          setStatus(Status.Inactive);
        }, DEFERRED_TIMEOUT);
      });
    }

    setStatus(Status.Inactive);
    return onToggle();
  }, [deferred, onToggle]);

  return <Button onClick={handleClick} status={status} />;
}

export function Button({onClick, status}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === Status.Inactive}
    />
  );
}
