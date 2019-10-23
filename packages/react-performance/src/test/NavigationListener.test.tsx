import React from 'react';
import {mount} from '@shopify/react-testing';
import {mockPerformance} from './utilities';
import {NavigationListener, PerformanceContext} from '..';

describe('<NavigationListener />', () => {
  it('sets up a navigation listener on the Performance context object', () => {
    const performance = mockPerformance();
    const listener = jest.fn();

    mount(
      <PerformanceContext.Provider value={performance}>
        <NavigationListener onNavigation={listener} />
      </PerformanceContext.Provider>,
    );

    const navigation = performance.simulateNavigation();
    expect(listener).toHaveBeenCalledWith(navigation);
  });

  it('cleans up the navigation listener when unmounted', () => {
    const performance = mockPerformance();
    const listener = jest.fn();

    const wrapper = mount(
      <PerformanceContext.Provider value={performance}>
        <NavigationListener onNavigation={listener} />
      </PerformanceContext.Provider>,
    );

    listener.mockClear();
    wrapper.unmount();
    performance.simulateNavigation();

    expect(listener).not.toHaveBeenCalled();
  });
});
