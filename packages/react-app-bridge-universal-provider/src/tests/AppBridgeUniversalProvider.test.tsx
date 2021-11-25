import React from 'react';
import faker from 'faker';
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';
import {extract} from '@shopify/react-effect/server';
import {mount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';

import {AppBridgeUniversalProvider} from '../AppBridgeUniversalProvider';

describe('<AppBridgeUniversalProvider />', () => {
  const assign = window.location.assign;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        assign: jest.fn(),
      },
    });
  });

  afterAll(() => {
    window.location.assign = assign;
  });

  it('renders an AppBridgeProvider with app bridge config from the prop', () => {
    const config = {
      apiKey: faker.lorem.word(),
      shopOrigin: faker.internet.domainName(),
      forceRedirect: true,
    };
    const appBridgeUniversalProvider = mount(
      <AppBridgeUniversalProvider {...config} />,
    );

    expect(
      appBridgeUniversalProvider,
    ).toContainReactComponent(AppBridgeProvider, {config});
  });

  it('renders an AppBridgeProvider with config from the serializer', async () => {
    const htmlManager = new HtmlManager();
    const config = {
      apiKey: faker.lorem.word(),
      shopOrigin: faker.internet.domainName(),
      forceRedirect: true,
    };

    // Simulated server render
    await extract(<AppBridgeUniversalProvider {...config} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const appBridgeUniversalProvider = mount(
      <HtmlContext.Provider value={htmlManager}>
        <AppBridgeUniversalProvider />
      </HtmlContext.Provider>,
    );

    expect(
      appBridgeUniversalProvider,
    ).toContainReactComponent(AppBridgeProvider, {config});
  });

  it('renders an AppBridgeProvider with value from server when value are provided on both server and client', async () => {
    const htmlManager = new HtmlManager();
    const serverConfig = {
      apiKey: faker.lorem.word(),
      shopOrigin: faker.internet.domainName(),
      forceRedirect: true,
    };
    const clientConfig = {
      apiKey: faker.lorem.word(),
      shopOrigin: faker.internet.domainName(),
      forceRedirect: false,
    };

    // Simulated server render
    await extract(<AppBridgeUniversalProvider {...serverConfig} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const appBridgeUniversalProvider = mount(
      <HtmlContext.Provider value={htmlManager}>
        <AppBridgeUniversalProvider {...clientConfig} />
      </HtmlContext.Provider>,
    );

    expect(appBridgeUniversalProvider).toContainReactComponent(
      AppBridgeProvider,
      {
        config: serverConfig,
      },
    );
  });
});
