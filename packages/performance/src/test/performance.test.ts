import {Performance} from '../performance';
import {Navigation} from '../navigation';

describe('Performance', () => {
  // We are not adding all the required tests here until we have time
  // to write a useful mock for Performance/ PerformanceObserver
  it.skip('records a navigation on finish', () => {
    const performance = new Performance();
    const spy = jest.fn();
    performance.on('navigation', spy);

    performance.finish();
    expect(spy).toHaveBeenCalledWith(expect.any(Navigation));
  });
});
