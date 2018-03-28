import lolex from 'lolex';

export default class Clock {
  isUsingFakeClock = false;

  private fakedClock?: lolex.Clock;

  fake(now: number | Date = Date.now()) {
    if (this.isUsingFakeClock) {
      throw new Error(
        'The clock is already faked, but you tried to fake it again.',
      );
    }

    this.isUsingFakeClock = true;
    this.fakedClock = lolex.install(now);
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
