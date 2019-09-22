import set from 'lodash/set';

type UserTimingMock = typeof window.performance.timing;

export default class Performance {
  private isUsingMockUserTiming = false;
  private originalUserTiming?: UserTimingMock;

  mock(timing: Partial<UserTimingMock> = {}) {
    if (this.isUsingMockUserTiming) {
      throw new Error(
        'You tried to mock window.performance.timing when it was already mocked.',
      );
    }

    this.originalUserTiming = window.performance.timing;

    const mockTiming: Partial<UserTimingMock> = {
      navigationStart: 0,
      unloadEventStart: 0,
      unloadEventEnd: 0,
      redirectStart: 0,
      redirectEnd: 0,
      fetchStart: 0,
      domainLookupStart: 0,
      domainLookupEnd: 0,
      connectStart: 0,
      connectEnd: 0,
      secureConnectionStart: 0,
      requestStart: 0,
      responseStart: 0,
      responseEnd: 0,
      domLoading: 0,
      domInteractive: 0,
      domContentLoadedEventStart: 0,
      domContentLoadedEventEnd: 0,
      domComplete: 0,
      loadEventStart: 0,
      loadEventEnd: 0,
      ...timing,
    };

    set(window.performance, 'timing', mockTiming);
    this.isUsingMockUserTiming = true;
  }

  restore() {
    if (!this.isUsingMockUserTiming) {
      throw new Error(
        'You tried to restore window.performance.timing when it was already restored.',
      );
    }

    set(window.performance, 'timing', this.originalUserTiming);
    this.isUsingMockUserTiming = false;
  }

  isMocked() {
    return this.isUsingMockUserTiming;
  }
}
