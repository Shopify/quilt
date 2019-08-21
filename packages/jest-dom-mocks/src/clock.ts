import lolex from 'lolex';

export default class Clock {
  private isUsingMockClock = false;
  private mockClock?: lolex.Clock;

  mock(now: number | Date = Date.now()) {
    if (this.isUsingMockClock) {
      throw new Error(
        'The clock is already mocked, but you tried to mock it again.',
      );
    }

    this.isUsingMockClock = true;
    this.mockClock = lolex.install({now});
  }

  restore() {
    if (!this.isUsingMockClock) {
      throw new Error(
        'The clock is already real, but you tried to restore it again.',
      );
    }

    this.isUsingMockClock = false;

    if (this.mockClock) {
      this.mockClock.uninstall();
      delete this.mockClock;
    }
  }

  isMocked() {
    return this.isUsingMockClock;
  }

  tick(time: number) {
    this.ensureClockIsMocked();
    if (this.mockClock) {
      this.mockClock.tick(time);
    }
  }

  setTime(time: number | Date) {
    this.ensureClockIsMocked();
    if (this.mockClock) {
      this.mockClock.setSystemTime(time);
    }
  }

  private ensureClockIsMocked() {
    if (!this.isUsingMockClock) {
      throw new Error(
        'You must call clock.mock() before interacting with the mock clock.',
      );
    }
  }
}
