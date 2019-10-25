import React from 'react';
import {mount} from '@shopify/react-testing';
import {mockPerformance} from './utilities';
import {PerformanceMark, PerformanceContext, Stage} from '..';

describe('<PerformanceMark />', () => {
  it('calls performance.mark', () => {
    const performance = mockPerformance({mark: jest.fn()});
    const stage = 'some custom stage';
    const id = 'test-id';

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceMark stage={stage} id={id} />
      </PerformanceContext.Provider>,
    );

    expect(performance.mark).toHaveBeenCalledWith(stage, id);
  });

  describe('when given a `stage` of `usable`', () => {
    it('calls Performance.usable', () => {
      const performance = mockPerformance({usable: jest.fn()});

      mount(
        <PerformanceContext.Provider value={performance}>
          <PerformanceMark stage={Stage.Usable} id="test-id" />
        </PerformanceContext.Provider>,
      );

      expect(performance.usable).toHaveBeenCalled();
    });
  });

  describe('when given a `stage` of `complete`', () => {
    it('calls Performance.finish', () => {
      const performance = mockPerformance({finish: jest.fn()});

      mount(
        <PerformanceContext.Provider value={performance}>
          <PerformanceMark stage={Stage.Complete} id="test-id" />
        </PerformanceContext.Provider>,
      );

      expect(performance.finish).toHaveBeenCalled();
    });
  });
});
