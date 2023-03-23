import type {ReactNode, ComponentProps} from 'react';
import React, {useRef} from 'react';
import type {Client} from '@bugsnag/js';
import type {BugsnagErrorBoundary} from '@bugsnag/plugin-react';

import {ErrorLoggerContext, noopErrorLogger} from './context';

export function NoopBoundary({children}: {children: ReactNode}) {
  return <>{children}</>;
}

export function Bugsnag({
  client,
  children,
  ...props
}: ComponentProps<BugsnagErrorBoundary> & {client: Client}) {
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
      <Boundary {...props}>{children}</Boundary>
    </ErrorLoggerContext.Provider>
  );
}
