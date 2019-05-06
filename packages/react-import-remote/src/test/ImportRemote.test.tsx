import * as React from 'react';
import {noop} from '@shopify/javascript-utilities/other';
import {mount} from '@shopify/react-testing';
import {Preconnect} from '@shopify/react-html';
import {DeferTiming} from '@shopify/async';

import {
  requestIdleCallback,
  intersectionObserver,
} from '@shopify/jest-dom-mocks';
import ImportRemote, {Props} from '../ImportRemote';

jest.mock('@shopify/react-html', () => ({
  Preconnect() {
    return null;
  },
}));

jest.mock('@shopify/react-intersection-observer', () => ({
  ...require.requireActual('@shopify/react-intersection-observer'),
  IntersectionObserver() {
    return null;
  },
}));

jest.mock('../load', () => jest.fn());

const load: jest.Mock = require.requireMock('../load');

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

  describe('source and getImport()', () => {
    it('uses the props as arguments for load()', () => {
      const nonce = '';
      mount(<ImportRemote {...mockProps} />);
      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );
    });

    it('uses the nonce prop as argument for load()', () => {
      const nonce = '1a2b3c';
      mount(<ImportRemote {...mockProps} nonce={nonce} />);
      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );
    });

    it('imports a new global if the source changes', () => {
      const nonce = '';
      const importRemote = mount(<ImportRemote {...mockProps} />);
      expect(load).toHaveBeenCalledWith(
        mockProps.source,
        mockProps.getImport,
        nonce,
      );

      const newSource = 'https://bar.com/foo.js';

      importRemote.setProps({source: newSource});
      expect(load).toHaveBeenCalledWith(newSource, mockProps.getImport, nonce);
    });
  });
  // async act is available in React 16.9.0, when we have upgraded the following
  // tests can be enabled. https://github.com/Shopify/quilt/pull/688
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('onImported()', () => {
    it('is called with the result of loading the script when successful', async () => {
      const result = 'foo';
      const promise = Promise.resolve(result);
      const spy = jest.fn();
      load.mockImplementation(() => promise);

      const importRemote = await mount(
        <ImportRemote {...mockProps} onImported={spy} />,
      );

      importRemote.act(async () => {
        await promise;
      });
      expect(spy).toHaveBeenCalledWith(result);
    });

    it('is called with a script loading error', async () => {
      const error = new Error();
      const promise = Promise.reject(error);
      const spy = jest.fn();
      load.mockImplementation(() => promise);

      const importRemote = await mount(
        <ImportRemote {...mockProps} onImported={spy} />,
      );

      importRemote.act(async () => {
        try {
          await promise;
          // eslint-disable-next-line no-empty
        } catch (_) {}
      });

      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  describe('preconnect', () => {
    it('does not render any preconnect link by default', () => {
      const importRemote = mount(<ImportRemote {...mockProps} />);

      expect(importRemote).not.toContainReactComponent(Preconnect);
    });

    it('creates a preconnect link with the source’s origin when preconnecting is requested', () => {
      const importRemote = mount(<ImportRemote {...mockProps} preconnect />);

      expect(importRemote).toContainReactComponent(Preconnect, {
        source: new URL(mockProps.source).origin,
      });
    });
  });

  describe('defer', () => {
    it('does not call load until idle when defer is DeferTiming.Idle', () => {
      const importRemote = mount(
        <ImportRemote {...mockProps} defer={DeferTiming.Idle} />,
      );

      expect(load).not.toHaveBeenCalled();

      importRemote.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('does not call load until the IntersectionObserver’s onIntersecting when defer is DeferTiming.InViewport', () => {
      intersectionObserver.simulate({
        isIntersecting: false,
      });

      const importRemote = mount(
        <ImportRemote {...mockProps} defer={DeferTiming.InViewport} />,
      );

      expect(load).not.toHaveBeenCalled();

      importRemote.act(() => {
        intersectionObserver.simulate({
          isIntersecting: true,
        });
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
