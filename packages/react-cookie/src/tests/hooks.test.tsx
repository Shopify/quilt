import React from 'react';
import {NetworkManager, NetworkContext} from '@shopify/react-network';
import {createMount} from '@shopify/react-testing';
import {CookieUniversalProvider} from '../CookieUniversalProvider';
import {useCookie, useCookies} from '../hooks';

const {hasDocumentCookie} = require.requireMock('../utilities');

jest.mock('../utilities', () => ({
  hasDocumentCookie: jest.fn(),
}));

describe('hooks', () => {
  beforeEach(() => {
    hasDocumentCookie.mockImplementation(() => true);
  });

  afterEach(() => {
    hasDocumentCookie.mockClear();
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
          <button type="button" onClick={() => setCookie(setValue)}>
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
  });

  describe('useCookies', () => {
    function MockComponent() {
      const allCookies = useCookies();

      const cookiesToRender = Object.keys(allCookies).map(key => (
        <p key={key}>{allCookies[key].value}</p>
      ));

      return <>{cookiesToRender}</>;
    }

    it('gets all cookies', () => {
      const key1 = 'foo';
      const value1 = 'bar';
      const key2 = 'baz';
      const value2 = 'qux';

      document.cookie = `${key1}=${value1};`;
      document.cookie = `${key2}=${value2};`;

      const wrapper = mount(<MockComponent />);

      expect(wrapper).toContainReactText(value1);
      expect(wrapper).toContainReactText(value2);
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
