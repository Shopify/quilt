import React from 'react';
import {createMount} from '@shopify/react-testing';
import {CookieManager} from '../manager';
import {CookiesUniversalProvider} from '../CookiesUniversalProvider';
import {useCookie, useCookies} from '../hooks';

describe('hooks', () => {
  describe('useCookie', () => {
    function MockComponent({cookie}: {cookie: string}) {
      const [value, setCookie] = useCookie(cookie);

      return (
        <>
          <button type="button" onClick={() => setCookie('baz')}>
            Set Cookie
          </button>
          {value}
        </>
      );
    }

    it('gets a cookie', () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = {[key]: value};

      const wrapper = mount(<MockComponent cookie={key} />, {
        manager: new CookieManager({...cookies}),
      });

      expect(wrapper).toContainReactText(value);
    });

    it('sets a cookie', () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = {[key]: value};

      const wrapper = mount(<MockComponent cookie={key} />, {
        manager: new CookieManager({...cookies}),
      });

      wrapper
        .find(MockComponent)!
        .find('button')!
        .trigger('onClick');

      expect(wrapper).toContainReactText(`baz`);
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

    it('gets cookies', () => {
      const cookies = {
        foo: 'bar',
        baz: 'qux',
      };

      const wrapper = mount(<MockComponent />, {
        manager: new CookieManager({...cookies}),
      });

      expect(wrapper).toContainReactText(cookies.foo);
      expect(wrapper).toContainReactText(cookies.baz);
    });
  });
});

const mount = createMount<{manager?: CookieManager}>({
  render: element => {
    return <CookiesUniversalProvider>{element}</CookiesUniversalProvider>;
  },
});
