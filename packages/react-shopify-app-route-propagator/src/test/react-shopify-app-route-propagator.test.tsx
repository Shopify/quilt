import React from 'react';
import {mount} from 'enzyme';

import RoutePropagator, {REPLACE_STATE_MESSAGE, MODAL_IFRAME_NAME} from '..';

jest.mock('../globals', () => {
  return {
    getOrigin: jest.fn(),
    getTopWindow: jest.fn(),
    getSelfWindow: jest.fn(),
  };
});

const mockUtilities = require.requireMock('../globals');
const {getOrigin, getTopWindow, getSelfWindow} = mockUtilities;

describe('@shopify/react-shopify-app-route-propagator', () => {
  const topWindow = {
    name: '',
    postMessage: jest.fn(),
  };
  const selfWindow = {
    name: '',
  };

  beforeEach(() => {
    getOrigin.mockImplementation(() => 'https://test.com');

    topWindow.postMessage.mockClear();
    getTopWindow.mockImplementation(() => topWindow);
    getSelfWindow.mockImplementation(() => selfWindow);
  });

  it('sends a post message on mount', () => {
    const path = '/settings';

    const propagator = mount(<RoutePropagator location={path} />);

    expect(topWindow.postMessage).toBeCalledWith(
      replaceStateMessage(path),
      '*',
    );
  });

  it('sends a post message when the location updates', () => {
    const propagator = mount(<RoutePropagator location="/settings" />);

    const path = '/foo';
    propagator.setProps({location: path});
    propagator.update();

    expect(topWindow.postMessage).toBeCalledWith(
      replaceStateMessage(path),
      '*',
    );
  });

  describe('when window is window.top', () => {
    it('does not send a post message on mount', () => {
      getSelfWindow.mockImplementation(() => topWindow);

      const propagator = mount(<RoutePropagator location="/settings" />);

      expect(topWindow.postMessage).not.toBeCalled();
    });

    it('does not send a post message when the location updates', () => {
      getSelfWindow.mockImplementation(() => topWindow);

      const propagator = mount(<RoutePropagator location="/settings" />);

      const path = '/foo';
      propagator.setProps({location: path});
      propagator.update();

      expect(topWindow.postMessage).not.toBeCalled();
    });
  });

  describe('when window is an iframe', () => {
    it('does not send a post message on mount', () => {
      getSelfWindow.mockImplementation(() => ({
        name: MODAL_IFRAME_NAME,
      }));
      const propagator = mount(<RoutePropagator location="/settings" />);

      expect(topWindow.postMessage).not.toBeCalled();
    });

    it('does not send a post message when the location updates', () => {
      getSelfWindow.mockImplementation(() => ({
        name: MODAL_IFRAME_NAME,
      }));

      const propagator = mount(<RoutePropagator location="/settings" />);

      propagator.setProps({location: '/foo'});
      propagator.update();

      expect(topWindow.postMessage).not.toBeCalled();
    });
  });
});

function replaceStateMessage(location: string) {
  return JSON.stringify({
    message: REPLACE_STATE_MESSAGE,
    data: {location},
  });
}
