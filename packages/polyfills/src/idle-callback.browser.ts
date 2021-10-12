// reference: https://developers.google.com/web/updates/2015/08/using-requestidlecallback
import {ExtendedWindow} from '@shopify/useful-types';

interface IdleCallback {
  (params: CallbackParams): void;
}

interface CallbackParams {
  didTimeout: boolean;
  timeRemaining(): number;
}
interface PolyfilledWindow extends Window {
  requestIdleCallback(cb: IdleCallback): any;
  cancelIdleCallback(): any;
}

// According to the spec the max value timeRemaining can return is 50
const MAX_TIME_REMAINING = 50;

function fallbackQueueingFunction(cb: IdleCallback) {
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

const extendedWindow = window as ExtendedWindow<PolyfilledWindow>;

extendedWindow.requestIdleCallback =
  extendedWindow.requestIdleCallback || fallbackQueueingFunction;

extendedWindow.cancelIdleCallback =
  extendedWindow.cancelIdleCallback || (window as any).clearImmediate;
