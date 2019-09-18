import React from 'react';
import {mount} from '@shopify/react-testing';
import {CookieUniversalProvider} from '../CookieUniversalProvider';
import {CookieManager} from '../manager';
import CookieMock from './cookie';

const cookie = new CookieMock();

jest.mock('../manager', () => ({
  CookieManager: jest.fn(),
}));

jest.mock('../utilities', () => ({
  hasDocumentCookie: jest.fn(),
}));

jest.mock('@shopify/react-network', () => ({
  useRequestHeader: jest.fn(),
}));

const {hasDocumentCookie} = require.requireMock('../utilities');
const {useRequestHeader} = require.requireMock('@shopify/react-network');

describe('<Cookie />', () => {
  function App() {
    return null;
  }

  beforeEach(() => {
    hasDocumentCookie.mockClear();
    useRequestHeader.mockClear();
    hasDocumentCookie.mockImplementation(() => true);
    useRequestHeader.mockImplementation(() => 'pizza');
  });

  it('creates a manager from the server-side header when there is no document cookie', () => {
    const someServerCookie = 'foo=bar;';

    hasDocumentCookie.mockReturnValue(false);
    useRequestHeader.mockReturnValue(someServerCookie);

    mount(
      <CookieUniversalProvider>
        <App />
      </CookieUniversalProvider>,
    );

    expect(CookieManager).toHaveBeenCalledWith(someServerCookie);
  });

  it('creates a manager from the client-side document cookie when one exists', () => {
    const someClientCookie = 'baz=qux;';

    hasDocumentCookie.mockReturnValue(true);
    cookie.mock(someClientCookie);

    mount(
      <CookieUniversalProvider>
        <App />
      </CookieUniversalProvider>,
    );

    expect(CookieManager).toHaveBeenCalledWith(someClientCookie);
  });
});
