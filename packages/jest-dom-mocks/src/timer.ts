export default class Timer {
  private isUsingFakeTimer = false;

  mock() {
    if (this.isUsingFakeTimer) {
      throw new Error(
        'The Timer is already mocked, but you tried to mock it again.',
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

  isMocked() {
    return this.isUsingFakeTimer;
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
        'You must call Timer.mock() before interacting with the mock Timer.',
      );
    }
  }
}
