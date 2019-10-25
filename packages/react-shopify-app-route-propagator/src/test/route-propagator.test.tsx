import * as React from 'react';
import {Context, ClientApplication} from '@shopify/app-bridge';
import {History as AppBridgeHistory} from '@shopify/app-bridge/actions';
import {act} from 'react-dom/test-utils';
import {mount} from '@shopify/react-testing';
import RoutePropagator from '../route-propagator';

jest.mock('../globals', () => {
  return {
    ...require.requireActual('../globals'),
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

  const mockApp = ({
    getState: jest.fn().mockReturnValue(Promise.resolve(Context.Main)),
  } as unknown) as ClientApplication<any>;

  const appBridgeHistoryMock = {
    dispatch: jest.fn(),
  };
  jest.spyOn(AppBridgeHistory, 'create').mockReturnValue(appBridgeHistoryMock);

  beforeEach(() => {
    jest.clearAllMocks();

    getOrigin.mockImplementation(() => 'https://test.com');
    getTopWindow.mockImplementation(() => topWindow);
    getSelfWindow.mockImplementation(() => selfWindow);
  });

  it('dispatch a replace action on mount', async () => {
    const path = '/settings';
    await act((async () => {
      await mount(<RoutePropagator location={path} app={mockApp} />);
    }) as any);

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(1);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledWith(
      AppBridgeHistory.Action.REPLACE,
      path,
    );
  });

  it('dispatch a replace action when the location updates', async () => {
    const firstPath = '/settings';
    let propagator;

    await act((async () => {
      propagator = await mount(
        <RoutePropagator location={firstPath} app={mockApp} />,
      );
    }) as any);

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(1);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenLastCalledWith(
      AppBridgeHistory.Action.REPLACE,
      firstPath,
    );

    const secondPath = '/foo';

    await act((async () => {
      await propagator.setProps({location: secondPath});
    }) as any);

    propagator.setProps({location: secondPath});

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(2);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenLastCalledWith(
      AppBridgeHistory.Action.REPLACE,
      secondPath,
    );
  });

  it('does not dispatch a replace action when the location updates but the value stay the same', async () => {
    const firstPath = '/settings';
    let propagator;
    await act((async () => {
      propagator = await mount(
        <RoutePropagator location={firstPath} app={mockApp} />,
      );
    }) as any);

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(1);
    expect(appBridgeHistoryMock.dispatch).toHaveBeenLastCalledWith(
      AppBridgeHistory.Action.REPLACE,
      firstPath,
    );

    await act((async () => {
      await propagator.setProps({location: firstPath});
    }) as any);

    expect(appBridgeHistoryMock.dispatch).toHaveBeenCalledTimes(1);
  });

  describe('when window is window.top', () => {
    it('does not dispatch a replace action on mount', async () => {
      getSelfWindow.mockImplementation(() => topWindow);

      await act((async () => {
        await mount(<RoutePropagator location="/settings" app={mockApp} />);
      }) as any);

      expect(appBridgeHistoryMock.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch a replace action when the location updates', async () => {
      getSelfWindow.mockImplementation(() => topWindow);

      let propagator;
      await act((async () => {
        propagator = await mount(
          <RoutePropagator location="/settings" app={mockApp} />,
        );
      }) as any);

      const path = '/foo';

      await act((async () => {
        await propagator.setProps({location: path});
      }) as any);

      expect(appBridgeHistoryMock.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when app is not a main app', () => {
    const modalApp = ({
      getState: jest.fn().mockReturnValue(Promise.resolve(Context.Modal)),
    } as unknown) as ClientApplication<any>;

    it('does not dispatch a replace action on mount', async () => {
      await act((async () => {
        await mount(<RoutePropagator location="/settings" app={modalApp} />);
      }) as any);

      expect(appBridgeHistoryMock.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch a replace action when the location updates', async () => {
      let propagator;

      await act((async () => {
        propagator = await mount(
          <RoutePropagator location="/settings" app={modalApp} />,
        );
      }) as any);

      await act((async () => {
        await propagator.setProps({location: '/foo'});
      }) as any);

      expect(appBridgeHistoryMock.dispatch).not.toHaveBeenCalled();
    });
  });
});
