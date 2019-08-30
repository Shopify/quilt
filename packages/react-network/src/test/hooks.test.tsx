import React from 'react';
import {mount} from '@shopify/react-testing';
import {NetworkManager} from '../manager';
import {NetworkContext} from '../context';
import {useCookie} from '../hooks';

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

    it('gets a cookie', async () => {
      const key = 'foo';
      const value = 'bar';
      const cookie = {[key]: value};

      const wrapper = await mountWithCookies(
        <MockComponent cookie={key} />,
        cookie,
      );

      expect(wrapper.find(MockComponent)).toContainReactText(value);
    });

    it('sets a cookie', async () => {
      const key = 'foo';
      const value = 'bar';
      const cookie = {[key]: value};

      const wrapper = await mountWithCookies(
        <MockComponent cookie={key} />,
        cookie,
      );

      wrapper
        .find(MockComponent)!
        .find('button')!
        .trigger('onClick');

      expect(wrapper.find(MockComponent)).toContainReactText(`baz`);
    });
  });
});

function mountWithCookies(
  component: React.ReactElement,
  cookies: Record<string, string>,
) {
  const manager = new NetworkManager({cookies});

  return mount(
    <NetworkContext.Provider value={manager}>
      {component}
    </NetworkContext.Provider>,
  );
}
