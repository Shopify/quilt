export default class Timer {
  isUsingFakeTimer = false;

  fake() {
    if (this.isUsingFakeTimer) {
      throw new Error(
        'The Timer is already faked, but you tried to fake it again.',
      );
    }

    jest.useFakeTimers();
    this.isUsingFakeTimer = true;
  }

  restore() {
    if (!this.isUsingFakeTimer) {
      throw new Error(
        'The Timer is already real, but you tried to restore it again.',
      );
    }

    jest.useRealTimers();
    this.isUsingFakeTimer = false;
  }

  runAllTimers() {
    this.ensureTimerIsFake();
    jest.runAllTimers();
  }

  runTimersToTime(time: number) {
    this.ensureTimerIsFake();
    jest.runTimersToTime(time);
  }

  private ensureTimerIsFake() {
    if (!this.isUsingFakeTimer) {
      throw new Error(
        'You must call Timer.fakeTimer() before interacting with the fake Timer.',
      );
    }
  }
}
