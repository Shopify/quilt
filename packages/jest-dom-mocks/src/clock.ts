import lolex from 'lolex';

export default class Clock {
  private isUsingFakeClock = false;
  private fakedClock?: lolex.Clock;

  mock(now: number | Date = Date.now()) {
    if (this.isUsingFakeClock) {
      throw new Error(
        'The clock is already mocked, but you tried to mock it again.',
      );
    }

    this.isUsingFakeClock = true;
    this.fakedClock = lolex.install({now});
  }

  restore() {
    if (!this.isUsingFakeClock) {
      throw new Error(
        'The clock is already real, but you tried to restore it again.',
      );
    }

    this.isUsingFakeClock = false;

    if (this.fakedClock) {
      this.fakedClock.uninstall();
      delete this.fakedClock;
    }
  }

  isMocked() {
    return this.isUsingFakeClock;
  }

  tick(time: number) {
    this.ensureClockIsFake();
    if (this.fakedClock) {
      this.fakedClock.tick(time);
    }
  }
  setTime(time: number) {
    this.ensureClockIsFake();
    if (this.fakedClock) {
      this.fakedClock.setSystemTime(time);
    }
  }

  private ensureClockIsFake() {
    if (!this.isUsingFakeClock) {
      throw new Error(
        'You must call clock.fakeClock() before interacting with the fake clock.',
      );
    }
  }
}
