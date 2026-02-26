export function lastCallArgs(spy: jest.Mock) {
  const calls = spy.mock.calls;
  return calls[calls.length - 1][0];
}
