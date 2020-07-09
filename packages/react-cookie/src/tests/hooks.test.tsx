import React from 'react';
import {NetworkManager, NetworkContext} from '@shopify/react-network';
import {createMount} from '@shopify/react-testing';

import {CookieUniversalProvider} from '../CookieUniversalProvider';
import {useCookie} from '../hooks';

import {clearCookies} from './utilities';

const {hasDocumentCookie} = jest.requireMock('../utilities');

jest.mock('../utilities', () => ({
  hasDocumentCookie: jest.fn(),
}));

describe('hooks', () => {
  beforeEach(() => {
    hasDocumentCookie.mockImplementation(() => true);
  });

  afterEach(() => {
    hasDocumentCookie.mockClear();
    clearCookies();
  });

  describe('useCookie', () => {
    function MockComponent({
      cookie,
      setValue,
    }: {
      cookie: string;
      setValue?: string;
    }) {
      const [value, setCookie] = useCookie(cookie);

      return (
        <>
          <button
            type="button"
            onClick={() => {
              if (value) {
                setCookie();
                return;
              }
              setCookie(setValue);
            }}
          >
            Set Cookie
          </button>
          {value}
        </>
      );
    }

    it('gets cookies from the browser', () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = `${key}=${value};`;

      document.cookie = cookies;

      const wrapper = mount(<MockComponent cookie={key} />);

      expect(wrapper).toContainReactText(value);
    });

    it('gets cookies from the server', () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = `${key}=${value};`;

      hasDocumentCookie.mockReturnValue(false);

      const wrapper = mount(<MockComponent cookie={key} />, {
        networkManager: new NetworkManager({cookies}),
      });

      expect(wrapper).toContainReactText(value);
    });

    it('sets a cookie', async () => {
      const setValue = 'bar';

      const wrapper = await mount(
        <MockComponent cookie="foo" setValue={setValue} />,
      );

      wrapper.find('button')!.trigger('onClick');

      expect(wrapper).toContainReactText(setValue);
    });

    it('removes a cookie', async () => {
      const setValue = 'bar';
      const wrapper = await mount(
        <MockComponent cookie="foo" setValue={setValue} />,
      );

      wrapper.find('button')!.trigger('onClick');
      expect(wrapper).toContainReactText(setValue);

      wrapper.find('button')!.trigger('onClick');
      expect(wrapper).not.toContainReactText(setValue);
    });
  });
});

const mount = createMount<{networkManager?: NetworkManager}>({
  render: (element, _, {networkManager = new NetworkManager()}) => (
    <NetworkContext.Provider value={networkManager}>
      <CookieUniversalProvider>{element}</CookieUniversalProvider>
    </NetworkContext.Provider>
  ),
});
