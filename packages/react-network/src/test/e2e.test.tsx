import React from 'react';
import {useServerEffect} from '@shopify/react-effect';
import {extract} from '@shopify/react-effect/server';

import {
  useStatus,
  useCspDirective,
  useRedirect,
  useHeader,
  StatusCode,
  CspDirective,
  Header,
} from '..';

import {NetworkContext, NetworkManager} from '../server';

describe('e2e', () => {
  it('clears network details between requests', async () => {
    const networkManager = new NetworkManager();
    const TwoPass = createMultiPassComponent(2);

    function Network() {
      useStatus(StatusCode.NotFound);
      useCspDirective(CspDirective.ChildSrc, 'https://*');
      useHeader(Header.CacheControl, 'no-cache');
      return null;
    }

    await extract(
      <>
        <TwoPass />
        <Network />
      </>,
      {
        decorate: element => (
          <NetworkContext.Provider value={networkManager}>
            {element}
          </NetworkContext.Provider>
        ),
      },
    );

    const extracted = networkManager.extract();
    expect(extracted).toHaveProperty('headers.size', 0);
    expect(extracted).toHaveProperty('status', undefined);
  });

  it('bails out when a redirect is set', async () => {
    const networkManager = new NetworkManager();
    const InfinitePass = createMultiPassComponent(Infinity);
    const afterEachPass = jest.fn();

    function Network() {
      useRedirect('https://example.com');
      return null;
    }

    await extract(
      <>
        <InfinitePass />
        <Network />
      </>,
      {
        decorate: element => (
          <NetworkContext.Provider value={networkManager}>
            {element}
          </NetworkContext.Provider>
        ),
      },
    );

    expect(afterEachPass).toHaveBeenCalledTimes(1);
  });
});

function createMultiPassComponent(passes: number) {
  let renderCount = 0;

  return function TwoPass() {
    useServerEffect(() => {
      renderCount += 1;
      return renderCount < passes ? Promise.resolve() : undefined;
    });

    return null;
  };
}
