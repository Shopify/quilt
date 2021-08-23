import React from 'react';
import {mount} from '@shopify/react-testing';

import {ErrorLoggerContext} from '../context';
import {Bugsnag} from '../Bugsnag';

describe('react-bugsnag', () => {
  it('renders an <ErrorLoggerContext /> with the given client', () => {
    const client = fakeBugsnag();
    const component = mount(<Bugsnag client={client} />);
    expect(component).toContainReactComponent(ErrorLoggerContext.Provider, {
      value: client,
    });
  });

  it('renders the ErrorBoundary from the plugin if it is present', () => {
    const client = fakeBugsnag();
    const Boundary = ({children}: {children: React.ReactNode}) => (
      <>{children}</>
    );

    client.getPlugin.mockImplementation(() => {
      return {
        createErrorBoundary: () => Boundary,
      };
    });

    const component = mount(<Bugsnag client={client} />);
    expect(component).toContainReactComponent(Boundary);
  });
});

function fakeBugsnag() {
  return {
    notify: jest.fn(),
    leaveBreadcrumb: jest.fn(),
    getPlugin: jest.fn(),
  } as any;
}
