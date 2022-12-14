import React, {useRef, ReactNode} from 'react';
import {Client, OnErrorCallback} from '@bugsnag/js';

import {ErrorLoggerContext, noopErrorLogger} from './context';

export function NoopBoundary({children}: {children: ReactNode}) {
  return <>{children}</>;
}

export function Bugsnag({
  client,
  children,
  onError,
  FallbackComponent,
}: {
  client?: Client;
  children?: React.ReactNode;
  // Copy-pasted @bugsang/plugin-react because this type is not exported or made otherwise available
  // through typescript
  onError?: OnErrorCallback;
  FallbackComponent?: React.ComponentType<{
    error: Error;
    info: React.ErrorInfo;
    clearError: () => void;
  }>;
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
      <Boundary FallbackComponent={FallbackComponent} onError={onError}>
        {children}
      </Boundary>
    </ErrorLoggerContext.Provider>
  );
}
