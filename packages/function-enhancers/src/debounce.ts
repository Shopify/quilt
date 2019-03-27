export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

interface Timer {
  ref(): void;
  unref(): void;
}

export default function debounce<
  FuncToDebounce extends (...args: any[]) => any
>(
  funcToDebounce: FuncToDebounce,
  // the number to delay in milliseconds
  wait = 0,
  options?: DebounceOptions,
): FuncToDebounce {
  const {leading = false, trailing = true} = options || {};

  let result: ReturnType<FuncToDebounce>;
  let lastArgs: Parameters<FuncToDebounce> | undefined;
  let lastThis: FuncToDebounce | undefined;
  let timer: Timer | undefined;

  function expireTimer() {
    timer = undefined;
  }

  function expireAndExecute() {
    result = funcToDebounce.apply(lastThis, lastArgs);
    lastThis = undefined;
    lastArgs = undefined;
    expireTimer();

    return result;
  }

  return function debounced(...args: Parameters<FuncToDebounce>) {
    // eslint-disable-next-line consistent-this
    lastThis = this;
    lastArgs = args;

    if (!timer) {
      if (leading) {
        expireAndExecute();
      }

      if (trailing) {
        timer = setTimeout(expireAndExecute, wait);
      }
    }

    if (leading) {
      timer = setTimeout(expireTimer, wait);
    } else if (trailing && leading) {
      return expireAndExecute();
    }

    return result;
  } as FuncToDebounce;
}
