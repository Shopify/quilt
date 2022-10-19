// According to the spec the max value timeRemaining can return is 50
const MAX_TIME_REMAINING = 50;

function fallbackQueueingFunction(cb: IdleRequestCallback) {
  const start = Date.now();
  return setImmediate(() => {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, MAX_TIME_REMAINING - (Date.now() - start));
      },
    });
  });
}

if (typeof window !== 'undefined') {
  window.requestIdleCallback =
    window.requestIdleCallback || fallbackQueueingFunction;

  window.cancelIdleCallback =
    window.cancelIdleCallback || window.clearImmediate;
}

export {};
