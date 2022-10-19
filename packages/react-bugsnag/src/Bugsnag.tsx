import React, {useRef, ReactNode, useMemo} from 'react';
import {Client} from '@bugsnag/js';

import {ErrorLoggerContext, developmentClient} from './context';

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

  const value = useMemo(() => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'development') {
      return developmentClient;
    }
    return client || developmentClient;
  }, [client]);

  return (
    <ErrorLoggerContext.Provider value={value}>
      <Boundary>{children}</Boundary>
    </ErrorLoggerContext.Provider>
  );
}
