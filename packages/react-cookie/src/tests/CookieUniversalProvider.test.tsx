import React from 'react';
import {createMount} from '@shopify/react-testing';
import {
  NetworkManager,
  NetworkContext,
  ServerCookieManager,
} from '@shopify/react-network';

import {CookieUniversalProvider} from '../CookieUniversalProvider';
import {CookieContext} from '../context';
import {BrowserCookieManager} from '../BrowserCookieManager';

const {hasDocumentCookie} = jest.requireMock('../utilities');

jest.mock('../utilities', () => ({
  hasDocumentCookie: jest.fn(),
}));

describe('CookieUniversalProvider', () => {
  beforeEach(() => {
    hasDocumentCookie.mockImplementation(() => true);
  });

  afterEach(() => {
    hasDocumentCookie.mockClear();
  });

  function MockApp() {
    return null;
  }

  it('provides a universal cookie manager for the server', () => {
    // Jest always has a document.cookie defined so mocking
    // is needed to test the server implementation
    hasDocumentCookie.mockImplementation(false);

    const wrapper = mount(
      <CookieUniversalProvider>
        <MockApp />
      </CookieUniversalProvider>,
    );

    const manager = wrapper.find(CookieContext.Provider)!.prop('value');
    expect(manager).toBeInstanceOf(ServerCookieManager);
  });

  it('provides a browser cookie manager when on the client', () => {
    const wrapper = mount(
      <CookieUniversalProvider>
        <MockApp />
      </CookieUniversalProvider>,
    );

    const manager = wrapper.find(CookieContext.Provider)!.prop('value');

    expect(manager).toBeInstanceOf(BrowserCookieManager);
  });
});

const mount = createMount<{networkManager?: NetworkManager}>({
  render: (element, _, {networkManager = new NetworkManager()}) => (
    <NetworkContext.Provider value={networkManager}>
      <CookieUniversalProvider>{element}</CookieUniversalProvider>
    </NetworkContext.Provider>
  ),
});
