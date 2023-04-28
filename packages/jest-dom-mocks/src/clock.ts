export default class Clock {
  private isUsingMockClock = false;

  mock(now: number | Date = Date.now()) {
    if (this.isUsingMockClock) {
      throw new Error(
        'The clock is already mocked, but you tried to mock it again.',
      );
    }

    jest.useFakeTimers({now});
    this.isUsingMockClock = true;
  }

  restore() {
    if (!this.isUsingMockClock) {
      throw new Error(
        'The clock is already real, but you tried to restore it again.',
      );
    }

    jest.useRealTimers();
    this.isUsingMockClock = false;
  }

  isMocked() {
    return this.isUsingMockClock;
  }

  tick(time: number) {
    this.ensureClockIsMocked();
    jest.advanceTimersByTime(time);
  }

  setTime(time: number | Date) {
    this.ensureClockIsMocked();
    jest.setSystemTime(time);
  }

  private ensureClockIsMocked() {
    if (!this.isUsingMockClock) {
      throw new Error(
        'You must call clock.mock() before interacting with the mock clock.',
      );
    }
  }
}
