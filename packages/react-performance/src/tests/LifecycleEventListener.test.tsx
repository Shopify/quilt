import React from 'react';
import {mount} from '@shopify/react-testing';

import {LifecycleEventListener, PerformanceContext} from '..';

import {mockPerformance} from './utilities';

describe('<LifecycleEventListener />', () => {
  it('sets up a event listener on the Performance context object', () => {
    const performance = mockPerformance();
    const listener = jest.fn();

    mount(
      <PerformanceContext.Provider value={performance}>
        <LifecycleEventListener onEvent={listener} />
      </PerformanceContext.Provider>,
    );

    const event = performance.simulateLifecycleEvent();
    expect(listener).toHaveBeenCalledWith(event);
  });

  it('cleans up the event listener when unmounted', () => {
    const performance = mockPerformance();
    const listener = jest.fn();

    const wrapper = mount(
      <PerformanceContext.Provider value={performance}>
        <LifecycleEventListener onEvent={listener} />
      </PerformanceContext.Provider>,
    );

    listener.mockClear();
    wrapper.unmount();
    performance.simulateLifecycleEvent();

    expect(listener).not.toHaveBeenCalled();
  });
});
