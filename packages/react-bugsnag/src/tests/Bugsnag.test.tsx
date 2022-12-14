import React from 'react';
import {mount} from '@shopify/react-testing';

import {ErrorLoggerContext} from '../context';
import {Bugsnag} from '../Bugsnag';

describe('react-bugsnag', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

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

  it('passes bugsnag ErrorBoundary props to <Boundary /> component', () => {
    const FakeBoundary = ({children}) => <>{children}</>;
    const client = {
      ...fakeBugsnag(),
      getPlugin: () => {
        return {
          createErrorBoundary: () => FakeBoundary,
        };
      },
    };

    const FallbackComponent = () => <div />;
    const onError = jest.fn();

    const component = mount(
      <Bugsnag
        client={client}
        FallbackComponent={FallbackComponent}
        onError={onError}
      />,
    );

    expect(component).toContainReactComponent(FakeBoundary, {
      FallbackComponent,
      onError,
    });
  });
});

function fakeBugsnag() {
  return {
    notify: jest.fn(),
    leaveBreadcrumb: jest.fn(),
    getPlugin: jest.fn(),
  } as any;
}
