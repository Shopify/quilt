import FakePromise from 'promise';

export default class Promise {
  private originalPromise = global.Promise;
  private isUsingFakePromise = false;

  mock() {
    if (this.isUsingFakePromise) {
      throw new Error(
        'Promise is already mocked, but you tried to mock it again.',
      );
    }

    jest.useFakeTimers();
    global.Promise = FakePromise as any;
    this.isUsingFakePromise = true;
  }

  restore() {
    if (!this.isUsingFakePromise) {
      throw new Error(
        'Promise is already real, but you tried to restore it again.',
      );
    }

    jest.useRealTimers();
    global.Promise = this.originalPromise;
    this.isUsingFakePromise = false;
  }

  isMocked() {
    return this.isUsingFakePromise;
  }

  runPending() {
    this.ensureUsingFakePromise();
    jest.runAllTimers();
  }

  private ensureUsingFakePromise() {
    if (!this.isUsingFakePromise) {
      throw new Error(
        'You must call Promise.mock() before interacting with the mock Promise.',
      );
    }
  }
}
