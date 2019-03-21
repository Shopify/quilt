const IGNORABLE_ERROR_EVENT_MESSAGES = [
  // This is part of the window.onError error object when a React
  // update errors out
  /at renderRoot/,
];

const IGNORABLE_TEST_ERRORS = [
  // This is the log for the actual error that got thrown
  /at mountIndeterminateComponent/,
  // This line follows any error thrown by a component
  /The above error occurred in (the <.*>|one of your React) components?:/,
  // This line comes up whenever an error happens as the result of something
  // that was being done within an `act` callback
  /was not wrapped in act\(\.\.\.\)/,
];

export function withIgnoredReactLogs<T>(run: () => T) {
  /* eslint-disable no-console */
  const originalConsoleError = console.error;

  const consoleError = (...args: any[]) => {
    const [firstArgument] = args;
    if (
      (typeof firstArgument === 'string' &&
        IGNORABLE_TEST_ERRORS.some(regex => regex.test(firstArgument))) ||
      (firstArgument instanceof Error &&
        firstArgument.stack != null &&
        IGNORABLE_TEST_ERRORS.some(regex =>
          regex.test(firstArgument.stack || ''),
        ))
    ) {
      return;
    }

    originalConsoleError.call(console, ...args);
  };

  function handleErrorEvent(event: ErrorEvent) {
    const {error} = event;

    // I want to silence all errors and know what I'm doing
    if (
      error != null &&
      IGNORABLE_ERROR_EVENT_MESSAGES.some(
        ignore => typeof error.stack === 'string' && ignore.test(error.stack),
      )
    ) {
      event.preventDefault();
    }
  }

  window.addEventListener('error', handleErrorEvent);

  console.error = consoleError;

  try {
    return run();
  } finally {
    console.error = originalConsoleError;
    window.removeEventListener('error', handleErrorEvent);
  }
  /* eslint-enable no-console */
}
