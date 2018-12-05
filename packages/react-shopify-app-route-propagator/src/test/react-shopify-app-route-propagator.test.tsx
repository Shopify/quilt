import * as React from 'react';
import {mount} from 'enzyme';
import {ClientApplication} from '@shopify/app-bridge';
import {History as AppBridgeHistory} from '@shopify/app-bridge/actions';

import RoutePropagator, {MODAL_IFRAME_NAME} from '..';

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
  };
  const selfWindow = {
    name: '',
  };

  const mockApp = {} as ClientApplication<any>;

  const appBridgeHistoryMock = {
    dispatch: jest.fn(),
  };
  AppBridgeHistory.create = jest.fn().mockReturnValue(appBridgeHistoryMock);

  beforeEach(() => {
    jest.clearAllMocks();

    getOrigin.mockImplementation(() => 'https://test.com');
    getTopWindow.mockImplementation(() => topWindow);
    getSelfWindow.mockImplementation(() => selfWindow);
  });

  it('dispatch a replace action on mount', () => {
    const path = '/settings';

    mount(<RoutePropagator location={path} app={mockApp} />);

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(1);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledWith(
      AppBridgeHistory.Action.REPLACE,
      path,
    );
  });

  it('dispatch a replace action when the location updates', () => {
    const firstPath = '/settings';
    const propagator = mount(
      <RoutePropagator location={firstPath} app={mockApp} />,
    );

    const secondPath = '/foo';
    propagator.setProps({location: secondPath});
    propagator.update();

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(2);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledWith(
      AppBridgeHistory.Action.REPLACE,
      firstPath,
    );
    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledWith(
      AppBridgeHistory.Action.REPLACE,
      secondPath,
    );
  });

  describe('when window is window.top', () => {
    it('does not dispatch a replace action on mount', () => {
      getSelfWindow.mockImplementation(() => topWindow);

      mount(<RoutePropagator location="/settings" app={mockApp} />);

      expect(appBridgeHistoryMock.dispatch).not.toBeCalled();
    });

    it('does not dispatch a replace action when the location updates', () => {
      getSelfWindow.mockImplementation(() => topWindow);

      const propagator = mount(
        <RoutePropagator location="/settings" app={mockApp} />,
      );

      const path = '/foo';
      propagator.setProps({location: path});
      propagator.update();

      expect(appBridgeHistoryMock.dispatch).not.toBeCalled();
    });
  });

  describe('when window is an iframe', () => {
    it('does not dispatch a replace action on mount', () => {
      getSelfWindow.mockImplementation(() => ({
        name: MODAL_IFRAME_NAME,
      }));
      mount(<RoutePropagator location="/settings" app={mockApp} />);

      expect(appBridgeHistoryMock.dispatch).not.toBeCalled();
    });

    it('does not dispatch a replace action when the location updates', () => {
      getSelfWindow.mockImplementation(() => ({
        name: MODAL_IFRAME_NAME,
      }));

      const propagator = mount(
        <RoutePropagator location="/settings" app={mockApp} />,
      );

      propagator.setProps({location: '/foo'});
      propagator.update();

      expect(appBridgeHistoryMock.dispatch).not.toBeCalled();
    });
  });
});
