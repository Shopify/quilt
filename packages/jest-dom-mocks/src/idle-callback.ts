import {
  WindowWithRequestIdleCallback,
  RequestIdleCallbackCallback,
} from '@shopify/async';

export default class IdleCallback {
  private isUsingMockRequestIdleCallback = false;
  private callbacks: {
    [key: number]: {
      callback: RequestIdleCallbackCallback;
      called: boolean;
    };
  } = {};
  private originalRequestIdleCallback: WindowWithRequestIdleCallback['requestIdleCallback'];
  private originalCancelIdleCallback: WindowWithRequestIdleCallback['cancelIdleCallback'];
  private currentIdleCallbackId = 0;

  mock() {
    if (this.isUsingMockRequestIdleCallback) {
      throw new Error(
        'You tried to mock window.requestIdleCallback when it was already mocked.',
      );
    }

    this.originalRequestIdleCallback = (window as any).requestIdleCallback;
    (window as any).requestIdleCallback = this.requestIdleCallback;

    this.originalCancelIdleCallback = (window as any).cancelIdleCallback;
    (window as any).cancelIdleCallback = this.cancelIdleCallback;

    this.isUsingMockRequestIdleCallback = true;
  }

  restore() {
    if (!this.isUsingMockRequestIdleCallback) {
      throw new Error(
        'You tried to restore window.requestIdleCallback when it was already restored.',
      );
    }

    (window as any).requestIdleCallback = this.originalRequestIdleCallback;
    (window as any).cancelIdleCallback = this.originalCancelIdleCallback;
    this.isUsingMockRequestIdleCallback = false;
  }

  isMocked() {
    return this.isUsingMockRequestIdleCallback;
  }

  private requestIdleCallback = (
    callback: RequestIdleCallbackCallback,
    timeout: number,
  ): number => {
    const mockHandler = {
      didTimeout: false,
      timeRemaining() {
        return 1;
      },
    };
    this.currentIdleCallbackId += 1;
    this.callbacks[this.currentIdleCallbackId] = Object.assign(
      {},
      this.callbacks[this.currentIdleCallbackId],
      {
        callback,
      },
    );

    setTimeout(() => {
      if (timeout) {
        if (!this.callbacks[this.currentIdleCallbackId].called) {
          setTimeout(() => {
            callback(mockHandler);
            this.callbacks[this.currentIdleCallbackId].called = true;
          }, timeout);
        }
      } else {
        callback(mockHandler);
        this.callbacks[this.currentIdleCallbackId].called = true;
      }
    }, 1);

    return this.currentIdleCallbackId;
  };

  private cancelIdleCallback = (handle: number) => {
    delete this.callbacks[handle];
  };
}
