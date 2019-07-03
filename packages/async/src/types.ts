export type Import<T> = T | {default: T};

export enum DeferTiming {
  Mount,
  Idle,
  InViewport,
}

export type RequestIdleCallbackHandle = any;

export interface RequestIdleCallbackOptions {
  timeout: number;
}

export interface RequestIdleCallbackDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

export type RequestIdleCallback = (
  deadline: RequestIdleCallbackDeadline,
) => void;

export interface WindowWithRequestIdleCallback {
  requestIdleCallback(
    callback: RequestIdleCallback,
    opts?: RequestIdleCallbackOptions,
  ): RequestIdleCallbackHandle;
  cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
}
