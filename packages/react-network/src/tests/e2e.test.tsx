import React from 'react';
import {extract} from '@shopify/react-effect/server';
import {useServerEffect} from '@shopify/react-effect';
import {StatusCode, CspDirective, Header} from '@shopify/network';

import {NetworkContext, NetworkManager} from '../server';
import {useStatus, useCspDirective, useRedirect, useHeader} from '../hooks';

describe('e2e', () => {
  it('clears network details between requests', async () => {
    const networkManager = new NetworkManager();
    const TwoPass = createMultiPassComponent(2, (pass) => {
      // This function only adds network details on the first pass,
      // which lets us verify that it was cleared out when the second pass
      // has finished.
      if (pass > 0) {
        return;
      }

      useStatus(StatusCode.NotFound);
      networkManager.cookies.setCookie('foo', 'bar');
      useCspDirective(CspDirective.ChildSrc, 'https://*');
      useHeader(Header.CacheControl, 'no-cache');
    });

    await extract(<TwoPass />, {
      decorate: (element) => (
        <NetworkContext.Provider value={networkManager}>
          {element}
        </NetworkContext.Provider>
      ),
    });

    const extracted = networkManager.extract();
    expect(extracted).toHaveProperty('headers.size', 0);
    expect(extracted).toHaveProperty('status', undefined);
    expect(extracted).toHaveProperty('cookies', {});
  });

  it('bails out when a redirect is set', async () => {
    const networkManager = new NetworkManager();
    const afterEachPass = jest.fn();

    const InfinitePass = createMultiPassComponent(Infinity, () => {
      useRedirect('https://example.com');
    });

    await extract(<InfinitePass />, {
      afterEachPass,
      decorate: (element) => (
        <NetworkContext.Provider value={networkManager}>
          {element}
        </NetworkContext.Provider>
      ),
    });

    expect(afterEachPass).toHaveBeenCalledTimes(1);
  });
});

function createMultiPassComponent(
  passes: number,
  hookUsage: (pass: number) => void,
) {
  let renderCount = 0;

  return function MultiPass() {
    hookUsage(renderCount);
    useServerEffect(() => {
      renderCount += 1;
      return renderCount < passes ? Promise.resolve() : undefined;
    });

    return null;
  };
}
