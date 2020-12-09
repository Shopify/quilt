import React from 'react';
import {DeferTiming} from '@shopify/async';
import {mount} from '@shopify/react-testing';
import {
  requestIdleCallback,
  intersectionObserver,
} from '@shopify/jest-dom-mocks';
import {Preconnect} from '@shopify/react-html';

import ImportRemote, {Props} from '../ImportRemote';

function noop() {}

jest.mock('@shopify/react-html', () => ({
  Preconnect() {
    return null;
  },
}));

jest.mock('@shopify/react-intersection-observer', () => ({
  ...jest.requireActual('@shopify/react-intersection-observer'),
  IntersectionObserver() {
    return null;
  },
}));

jest.mock('../load', () => jest.fn());

const load: jest.Mock = jest.requireMock('../load');

describe('<ImportRemote />', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
    intersectionObserver.mock();
    load.mockClear();
  });

  afterEach(() => {
    requestIdleCallback.restore();
    intersectionObserver.restore();
  });

  const mockProps: Props = {
    source: 'https://foo.com/bar.js',
    getImport: () => 'foo',
    onImported: noop,
  };

  function createResolvableLoad(value?: any) {
    const promise = Promise.resolve(value);
    load.mockImplementationOnce(() => promise);

    return () => promise;
  }

  describe('source and getImport()', () => {
    it('uses the props as arguments for load()', async () => {
      const resolve = createResolvableLoad();
      const nonce = '';
      const importRemote = mount(<ImportRemote {...mockProps} />);

      await importRemote.act(async () => {
        await resolve();
      });

      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );
    });

    it('uses the nonce prop as argument for load()', async () => {
      const resolve = createResolvableLoad();
      const nonce = '1a2b3c';
      const importRemote = mount(<ImportRemote {...mockProps} nonce={nonce} />);

      await importRemote.act(async () => {
        await resolve();
      });

      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );
    });

    it('imports a new global if the source changes', async () => {
      const nonce = '';
      const resolve = createResolvableLoad();
      const importRemote = mount(<ImportRemote {...mockProps} />);

      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );

      const newSource = 'https://bar.com/foo.js';

      await importRemote.act(async () => {
        importRemote.setProps({source: newSource});
        await resolve();
      });

      expect(load).toHaveBeenCalledWith(newSource, mockProps.getImport, nonce);
    });
  });

  describe('onImported()', () => {
    it('is called with the result of loading the script when successful', async () => {
      const result = 'foo';
      const spy = jest.fn();
      const resolve = createResolvableLoad(result);

      const importRemote = mount(
        <ImportRemote {...mockProps} onImported={spy} />,
      );

      await importRemote.act(async () => {
        await resolve();
      });

      expect(spy).toHaveBeenCalledWith(result);
    });

    it('is called with a script loading error', async () => {
      const error = new Error();
      const promise = Promise.reject(error);
      const spy = jest.fn();
      load.mockImplementation(() => promise);

      const importRemote = mount(
        <ImportRemote {...mockProps} onImported={spy} />,
      );

      await importRemote.act(async () => {
        try {
          await promise;
          // eslint-disable-next-line no-empty
        } catch (_) {}
      });

      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  describe('preconnect', () => {
    it('does not render any preconnect link by default', async () => {
      const resolve = createResolvableLoad();
      const importRemote = mount(<ImportRemote {...mockProps} />);

      await importRemote.act(async () => {
        await resolve();
      });

      expect(importRemote).not.toContainReactComponent(Preconnect);
    });

    it('creates a preconnect link with the source’s origin when preconnecting is requested', async () => {
      const resolve = createResolvableLoad();
      const importRemote = mount(<ImportRemote {...mockProps} preconnect />);

      await importRemote.act(async () => {
        await resolve();
      });

      expect(importRemote).toContainReactComponent(Preconnect, {
        source: new URL(mockProps.source).origin,
      });
    });
  });

  describe('defer', () => {
    it('does not call load until idle when defer is DeferTiming.Idle', async () => {
      const resolve = createResolvableLoad();

      const importRemote = mount(
        <ImportRemote {...mockProps} defer={DeferTiming.Idle} />,
      );

      expect(load).not.toHaveBeenCalled();

      await importRemote.act(async () => {
        requestIdleCallback.runIdleCallbacks();

        await resolve();
      });

      expect(load).toHaveBeenCalled();
    });

    it('does not call load until the IntersectionObserver’s onIntersecting when defer is DeferTiming.InViewport', async () => {
      const resolve = createResolvableLoad();

      intersectionObserver.simulate({
        isIntersecting: false,
      });

      const importRemote = mount(
        <ImportRemote {...mockProps} defer={DeferTiming.InViewport} />,
      );

      expect(load).not.toHaveBeenCalled();

      await importRemote.act(async () => {
        intersectionObserver.simulate({
          isIntersecting: true,
        });

        await resolve();
      });

      expect(load).toHaveBeenCalled();
    });

    it('throws an error when the defer prop is changed', () => {
      function MockComponent() {
        const [defer, setDefer] = React.useState<DeferTiming>(
          DeferTiming.Mount,
        );

        function handleOnClick() {
          setDefer(DeferTiming.InViewport);
        }

        return (
          <>
            <button onClick={handleOnClick} type="button">
              Set Defer
            </button>
            <ImportRemote {...mockProps} defer={defer} />
          </>
        );
      }

      const mockComponent = mount(<MockComponent />);

      expect(() => mockComponent.find('button')!.trigger('onClick')).toThrow(
        [
          'You’ve changed the defer strategy on an <ImportRemote />',
          'component after it has mounted. This is not supported.',
        ].join(' '),
      );
    });
  });
});
