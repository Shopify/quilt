import React from 'react';
import {mount} from '@shopify/react-testing';

import {mockPerformance} from './utilities';

import {
  usePerformanceEffect,
  PerformanceEffectCallback,
  PerformanceContext,
} from '..';

describe('usePerformanceEffect', () => {
  function TestComponent({callback}: {callback: PerformanceEffectCallback}) {
    usePerformanceEffect(callback);
    return <div>nothing of note ;P</div>;
  }

  it('calls the given callback and passes in the Performance object when there is one in context', () => {
    const performance = mockPerformance();
    const spy = jest.fn();

    mount(
      <PerformanceContext.Provider value={performance}>
        <TestComponent callback={spy} />
      </PerformanceContext.Provider>,
    );

    expect(spy).toHaveBeenCalledWith(performance);
  });

  it('calls the function returned from the given callback when the component is unmounted', () => {
    const performance = mockPerformance();
    const spy = jest.fn();

    const wrapper = mount(
      <PerformanceContext.Provider value={performance}>
        <TestComponent callback={() => spy} />
      </PerformanceContext.Provider>,
    );

    expect(spy).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
  });
});
