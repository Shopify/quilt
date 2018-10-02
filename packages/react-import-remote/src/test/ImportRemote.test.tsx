import * as React from 'react';
import {mount} from 'enzyme';
import Preconnect from '@shopify/react-preconnect';
import {noop} from '@shopify/javascript-utilities/other';

import ImportRemote, {Props} from '../ImportRemote';

jest.mock('react-helmet', () => ({
  Helmet: function Helmet({children}: any) {
    return children || null;
  },
}));

jest.mock('../load', () => jest.fn());

const load: jest.Mock = require.requireMock('../load');

describe('<ImportRemote />', () => {
  beforeEach(() => {
    load.mockClear();
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

    it('creates a preconnect link with the source’s hostname when preconnecting is requested', () => {
      const importRemote = mount(<ImportRemote {...mockProps} preconnect />);

      expect(importRemote.find(Preconnect).prop('hosts')).toEqual([
        new URL(mockProps.source).hostname,
      ]);
    });
  });
});
