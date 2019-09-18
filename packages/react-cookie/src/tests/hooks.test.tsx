import React from 'react';
import {mount} from '@shopify/react-testing';
import {CookieUniversalProvider} from '../CookieUniversalProvider';
import {useCookie, useCookies} from '../hooks';
import CookieMock from './cookie';

const cookie = new CookieMock();

describe('hooks', () => {
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

    beforeEach(() => {
      cookie.restore();
    });

    it('gets a cookie', () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = `${key}=${value};`;

      cookie.mock(cookies);

      const wrapper = mount(
        <CookieUniversalProvider>
          <MockComponent cookie={key} />
        </CookieUniversalProvider>,
      );

      expect(wrapper).toContainReactText(value);
    });

    it('sets a cookie', async () => {
      const setValue = 'bar';

      const wrapper = await mount(
        <CookieUniversalProvider>
          <MockComponent cookie="foo" setValue={setValue} />
        </CookieUniversalProvider>,
      );

      wrapper
        .find(MockComponent)!
        .find('button')!
        .trigger('onClick');

      expect(wrapper).toContainReactText(setValue);
    });
  });

  describe('useCookies', () => {
    function MockComponent() {
      const [allCookies] = useCookies();

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

      cookie.mock(`${key1}=${value1};${key2}=${value2}`);

      const wrapper = mount(
        <CookieUniversalProvider>
          <MockComponent />
        </CookieUniversalProvider>,
      );

      expect(wrapper).toContainReactText(value1);
      expect(wrapper).toContainReactText(value2);
    });
  });
});
