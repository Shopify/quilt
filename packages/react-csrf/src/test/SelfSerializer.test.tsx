import React from 'react';
import faker from 'faker';

import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {extract} from '@shopify/react-effect/server';
import {mount} from '@shopify/react-testing';

import {CsrfTokenContext} from '../context';
import {CsrfSelfSerializer} from '../SelfSerializer';

describe('<CsrfSelfSerializer />', () => {
  it('renders an CsrfTokenContext.Provider with token value from the prop', () => {
    const token = faker.lorem.word();
    const csrf = mount(<CsrfSelfSerializer token={token} />);

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: token,
    });
  });

  it('renders an CsrfTokenContext.Provider with token value from the serializes csrf token', async () => {
    const htmlManager = new HtmlManager();
    const token = faker.lorem.word();

    // Simulated server render
    await extract(<CsrfSelfSerializer token={token} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const csrf = mount(
      <HtmlContext.Provider value={htmlManager}>
        <CsrfSelfSerializer />
      </HtmlContext.Provider>,
    );

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: token,
    });
  });

  it('renders an CsrfTokenContext.Provider with token value from the serializes value when value are provided on both server and client', async () => {
    const htmlManager = new HtmlManager();
    const serverToken = faker.lorem.word();
    const clientToken = faker.lorem.word();

    // Simulated server render
    await extract(<CsrfSelfSerializer token={serverToken} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const csrf = mount(
      <HtmlContext.Provider value={htmlManager}>
        <CsrfSelfSerializer token={clientToken} />
      </HtmlContext.Provider>,
    );

    expect(csrf).toContainReactComponent(CsrfTokenContext.Provider, {
      value: serverToken,
    });
  });
});
