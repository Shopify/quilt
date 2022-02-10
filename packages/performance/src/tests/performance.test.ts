import {Performance} from '../performance';
import {Navigation} from '../navigation';
import {EventType} from '../types';

type FirstInputDelayCallback = Parameters<PerfMetrics['onFirstInputDelay']>[0];

describe('Performance', () => {
  // We are not adding all the required tests here until we have time
  // to write a useful mock for Performance/ PerformanceObserver
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('records a navigation on finish', () => {
    const performance = new Performance();
    const spy = jest.fn();
    performance.on('navigation', spy);

    performance.finish();
    expect(spy).toHaveBeenCalledWith(expect.any(Navigation));
  });

  // This can unskip once mocks are available for either:
  // - `performance.timing`
  // - `PerformanceNavigationTiming` and `PerformanceObserver`
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('first-input-delay', () => {
    class MockPerfMetrics implements PerfMetrics {
      private _callback: FirstInputDelayCallback | null = null;

      get callback() {
        return this._callback;
      }

      onFirstInputDelay(callback) {
        this._callback = callback;
      }
    }

    it('registers a first-input-delay listener', () => {
      const perfMetrics = new MockPerfMetrics();
      window.perfMetrics = perfMetrics;

      // eslint-disable-next-line no-new
      new Performance();
      expect(perfMetrics.callback).not.toBeNull();
    });

    it('sends first-interaction-delay lifecycle event', () => {
      const perfMetrics = new MockPerfMetrics();
      window.perfMetrics = perfMetrics;

      const lifecycleSpy = jest.fn();
      const performance = new Performance();
      performance.on('lifecycleEvent', lifecycleSpy);

      perfMetrics.callback!(1000, new Event('click'));

      expect(lifecycleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EventType.FirstInputDelay,
          duration: 1000,
        }),
      );
    });
  });
});
