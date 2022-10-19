import React from 'react';
import {mount} from '@shopify/react-testing';

import {ErrorLoggerContext, developmentClient} from '../context';
import {Bugsnag} from '../Bugsnag';

// eslint-disable-next-line no-process-env
const ORIGINAL_ENV = process.env;

describe('react-bugsnag', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  afterAll(() => {
    // eslint-disable-next-line no-process-env
    process.env = ORIGINAL_ENV;
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

  it('renders an <ErrorLoggerContext /> with the development client if NODE_ENV is development', () => {
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV = 'development';
    const client = fakeBugsnag();
    const component = mount(<Bugsnag client={client} />);
    expect(component).toContainReactComponent(ErrorLoggerContext.Provider, {
      value: developmentClient,
    });
  });

  it('renders an <ErrorLoggerContext /> with the development client if no client is passed', () => {
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV = 'development';
    const component = mount(<Bugsnag />);
    expect(component).toContainReactComponent(ErrorLoggerContext.Provider, {
      value: developmentClient,
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
