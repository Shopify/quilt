import * as React from 'react';
import {mount} from 'enzyme';
import {Preconnect} from '@shopify/react-html';
import {DeferTiming} from '@shopify/async';
import {IntersectionObserver} from '@shopify/react-intersection-observer';
import {noop} from '@shopify/javascript-utilities/other';
import {requestIdleCallback} from '@shopify/jest-dom-mocks';
import {trigger} from '@shopify/enzyme-utilities';

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
    load.mockClear();
  });

  afterEach(() => {
    requestIdleCallback.restore();
  });

  const mockProps: Props = {
    source: 'https://foo.com/bar.js',
    getImport: () => 'foo',
    onImported: noop,
    onError: noop,
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

  describe('onImported()', () => {
    it('is not called when the script errors', async () => {
      const spy = jest.fn();
      const promise = Promise.reject(new Error());
      load.mockImplementation(() => promise);

      mount(<ImportRemote {...mockProps} onImported={spy} />);

      try {
        await promise;
        // eslint-disable-next-line no-empty
      } catch (_) {}

      expect(spy).not.toHaveBeenCalled();
    });

    it('is called with a the result of loading the script', async () => {
      const result = 'foo';
      const promise = Promise.resolve(result);
      const spy = jest.fn();
      load.mockImplementation(() => promise);

      mount(<ImportRemote {...mockProps} onImported={spy} />);

      await promise;
      expect(spy).toHaveBeenCalledWith(result);
    });
  });

  describe('onError()', () => {
    it('is not called when the script loads successfully', () => {
      const spy = jest.fn();
      mount(<ImportRemote {...mockProps} onError={spy} />);
      expect(spy).not.toHaveBeenCalled();
    });

    it('is called with a script loading error', async () => {
      const error = new Error();
      const promise = Promise.reject(error);
      const spy = jest.fn();
      load.mockImplementation(() => promise);

      mount(<ImportRemote {...mockProps} onError={spy} />);

      try {
        await promise;
        // eslint-disable-next-line no-empty
      } catch (_) {}

      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  describe('preconnect', () => {
    it('does not render any preconnect link by default', () => {
      const importRemote = mount(<ImportRemote {...mockProps} />);

      expect(importRemote.find(Preconnect)).toHaveLength(0);
    });

    it('creates a preconnect link with the source’s origin when preconnecting is requested', () => {
      const importRemote = mount(<ImportRemote {...mockProps} preconnect />);

      expect(importRemote.find(Preconnect).prop('source')).toBe(
        new URL(mockProps.source).origin,
      );
    });
  });

  describe('defer', () => {
    it('does not call load until idle when defer is DeferTiming.Idle', () => {
      mount(<ImportRemote {...mockProps} defer={DeferTiming.Idle} />);
      expect(load).not.toHaveBeenCalled();
      requestIdleCallback.runIdleCallbacks();
      expect(load).toHaveBeenCalled();
    });

    it('does not call load until the IntersectionObserver’s onIntersecting when defer is DeferTiming.InViewport', async () => {
      const importRemote = mount(
        <ImportRemote {...mockProps} defer={DeferTiming.InViewport} />,
      );
      expect(load).not.toHaveBeenCalled();

      expect(importRemote.find(IntersectionObserver)).toHaveProp(
        'threshold',
        0,
      );

      await trigger(
        importRemote.find(IntersectionObserver),
        'onIntersectionChange',
        {isIntersecting: true},
      );

      expect(importRemote.find(IntersectionObserver)).toHaveLength(0);
      expect(load).toHaveBeenCalled();
    });
  });
});
