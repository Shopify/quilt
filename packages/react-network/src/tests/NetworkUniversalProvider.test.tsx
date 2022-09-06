import React from 'react';
import {createMount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {extract} from '@shopify/react-effect/server';

import {NetworkContext, NetworkUniversalContext} from '../context';
import {NetworkManager} from '../manager';
import {NetworkUniversalProvider} from '../NetworkUniversalProvider';
import {useRequestHeader} from '../hooks';

const mount = createMount<{htmlManager?: HtmlManager}>({
  render: (element, _, {htmlManager = new HtmlManager()}) => (
    <HtmlContext.Provider value={htmlManager}>{element}</HtmlContext.Provider>
  ),
});

const headerNames = (headers) => Object.keys(headers);

function generateTestKey(index) {
  return `key-${index}`;
}

function TestApp({headers = []}: {headers: string[]}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const headerValues = headers.map((header) => useRequestHeader(header));

  return (
    <>
      {headerValues.map((headerValue, index) => (
        <div key={generateTestKey(index)}>{`${headerValue}`}</div>
      ))}
    </>
  );
}

describe('NetworkUniversalProvider', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('renders a NetworkUniversalContext', () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const headers = {
      'x-some-header-1': 'header-value-1',
      'x-some-header-2': 'header-value-2',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const wrapper = mount(
      <NetworkContext.Provider value={new NetworkManager({headers})}>
        <NetworkUniversalProvider headers={headerNames(headers)}>
          <TestApp headers={headerNames(headers)} />
        </NetworkUniversalProvider>
      </NetworkContext.Provider>,
    );

    expect(wrapper).toProvideReactContext(
      NetworkUniversalContext,
      expect.objectContaining({
        headers,
      }),
    );
    expect(wrapper.find(TestApp)).toContainReactText('header-value-1');
    expect(wrapper.find(TestApp)).toContainReactText('header-value-2');
  });

  it('provides the same network details on both server and client-side renders', async () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const headers = {
      'x-some-header-1': 'header-value-1',
      'x-some-header-2': 'header-value-2',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const htmlManager = new HtmlManager();

    await extract(<NetworkUniversalProvider headers={headerNames(headers)} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          <NetworkContext.Provider value={new NetworkManager({headers})}>
            {element}
          </NetworkContext.Provider>
        </HtmlContext.Provider>
      ),
    });

    const wrapper = mount(
      <NetworkUniversalProvider headers={headerNames(headers)}>
        <TestApp headers={headerNames(headers)} />
      </NetworkUniversalProvider>,
      {htmlManager},
    );

    expect(wrapper).toProvideReactContext(
      NetworkUniversalContext,
      expect.objectContaining({
        headers,
      }),
    );
    expect(wrapper.find(TestApp)).toContainReactText('header-value-1');
    expect(wrapper.find(TestApp)).toContainReactText('header-value-2');
  });

  describe('errors', () => {
    it('throws an error when NetworkContext.Provider is missing', async () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const headers = {
        'x-some-header-1': 'header-value-1',
        'x-some-header-2': 'header-value-2',
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      const htmlManager = new HtmlManager();

      await expect(
        extract(<NetworkUniversalProvider headers={headerNames(headers)} />, {
          decorate: (element: React.ReactNode) => (
            <HtmlContext.Provider value={htmlManager}>
              {element}
            </HtmlContext.Provider>
          ),
        }),
      ).rejects.toStrictEqual(
        new Error(
          'You must provide a network-details value, or have one previously serialized.',
        ),
      );
    });

    it('does not throw an error when NetworkUniversalProvider is missing', async () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const headers = {
        'x-some-header-1': 'header-value-1',
        'x-some-header-2': 'header-value-2',
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      const htmlManager = new HtmlManager();
      await extract(<div />, {
        decorate: (element: React.ReactNode) => (
          <HtmlContext.Provider value={htmlManager}>
            <NetworkContext.Provider value={new NetworkManager({headers})}>
              {element}
            </NetworkContext.Provider>
          </HtmlContext.Provider>
        ),
      });

      expect(() => {
        const wrapper = mount(<TestApp headers={headerNames(headers)} />, {
          htmlManager,
        });

        expect(wrapper).toContainReactText('undefined');
      }).not.toThrow(expect.any(Error));
    });
  });
});
