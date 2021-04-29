export default class Timer {
  private isUsingFakeTimers = false;

  mock() {
    if (this.isUsingFakeTimers) {
      throw new Error(
        'The Timer is already mocked, but you tried to mock it again.',
      );
    }

    jest.useFakeTimers();
    this.isUsingFakeTimers = true;
  }

  restore() {
    if (!this.isUsingFakeTimers) {
      throw new Error(
        'The Timer is already real, but you tried to restore it again.',
      );
    }

    jest.useRealTimers();
    this.isUsingFakeTimers = false;
  }

  isMocked() {
    return this.isUsingFakeTimers;
  }

  runAllTimers() {
    this.ensureUsingFakeTimers();
    jest.runAllTimers();
  }

  runTimersToTime(time: number) {
    this.ensureUsingFakeTimers();
    jest.advanceTimersByTime(time);
  }

  private ensureUsingFakeTimers() {
    if (!this.isUsingFakeTimers) {
      throw new Error(
        'You must call Timer.mock() before interacting with the mock Timer.',
      );
    }
  }
}
