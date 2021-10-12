const IGNORABLE_TEST_ERRORS = [
  /React does not recognize the `testID` prop on a DOM element/,
];

/* eslint-disable no-console */
const originalTestConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  const [firstArgument] = args;
  if (
    typeof firstArgument === 'string' &&
    IGNORABLE_TEST_ERRORS.some((regex) => regex.test(firstArgument))
  ) {
    return;
  }

  originalTestConsoleError(...args);
};
/* eslint-enable no-console */
