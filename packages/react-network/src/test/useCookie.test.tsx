import React from 'react';
import {createMount} from '@shopify/react-testing';
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
      const cookies = {[key]: value};

      const wrapper = await mount(<MockComponent cookie={key} />, {
        manager: new NetworkManager({cookies}),
      });

      expect(wrapper).toContainReactText(value);
    });

    it('sets a cookie', async () => {
      const key = 'foo';
      const value = 'bar';
      const cookies = {[key]: value};

      const wrapper = await mount(<MockComponent cookie={key} />, {
        manager: new NetworkManager({cookies}),
      });

      wrapper
        .find(MockComponent)!
        .find('button')!
        .trigger('onClick');

      expect(wrapper).toContainReactText(`baz`);
    });
  });
});

const mount = createMount<{manager?: NetworkManager}>({
  render: (element, _, {manager = new NetworkManager()}) => {
    return (
      <NetworkContext.Provider value={manager}>
        {element}
      </NetworkContext.Provider>
    );
  },
});
