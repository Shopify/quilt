import React from 'react';
import faker from 'faker';
import {extract} from '@shopify/react-effect/server';
import {CsrfTokenContext} from '@shopify/react-csrf';
import {mount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';

import {CsrfUniversalProvider} from '../CsrfUniversalProvider';

describe('<CsrfUniversalProvider />', () => {
  it('renders a CsrfTokenContext.Provider with token value from the prop', () => {
    const token = faker.lorem.word();
    const csrf = mount(<CsrfUniversalProvider value={token} />);

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: token,
    });
  });

  it('renders a CsrfTokenContext.Provider with token value from the serializes csrf token', async () => {
    const htmlManager = new HtmlManager();
    const token = faker.lorem.word();

    // Simulated server render
    await extract(<CsrfUniversalProvider value={token} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const csrf = mount(
      <HtmlContext.Provider value={htmlManager}>
        <CsrfUniversalProvider />
      </HtmlContext.Provider>,
    );

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: token,
    });
  });

  it('renders a CsrfTokenContext.Provider with value from server when value are provided on both server and client', async () => {
    const htmlManager = new HtmlManager();
    const serverToken = faker.lorem.word();
    const clientToken = faker.lorem.word();

    // Simulated server render
    await extract(<CsrfUniversalProvider value={serverToken} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const csrf = mount(
      <HtmlContext.Provider value={htmlManager}>
        <CsrfUniversalProvider value={clientToken} />
      </HtmlContext.Provider>,
    );

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: serverToken,
    });
  });
});
