import React, {useRef, ReactNode} from 'react';
import {Client} from '@bugsnag/js';

import {ErrorLoggerContext, noopErrorLogger} from './context';

export function NoopBoundary({children}: {children: ReactNode}) {
  return <>{children}</>;
}

export function Bugsnag({
  client,
  children,
}: {
  client?: Client;
  children?: React.ReactNode;
}) {
  const Boundary = useRef(() => {
    if (client) {
      const reactPlugin = client.getPlugin('react');
      if (reactPlugin == null) {
        // eslint-disable-next-line no-console
        console.warn(
          'You are using bugsnag without the React plugin. For better insight into your errors you should add @bugsnag/plugin-react to your configuration.',
        );
        return NoopBoundary;
      }

      return reactPlugin.createErrorBoundary(React);
    }
    return NoopBoundary;
  }).current();

  return (
    <ErrorLoggerContext.Provider value={client || noopErrorLogger}>
      <Boundary>{children}</Boundary>
    </ErrorLoggerContext.Provider>
  );
}
