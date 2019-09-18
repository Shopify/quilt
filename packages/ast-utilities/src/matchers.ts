import {
  matcherHint,
  printExpected,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeFormated(expected: string): void;
    }
  }
}
export function toBeFormated(
  this: jest.MatcherUtils,
  received: string,
  expected: string,
) {
  const formatedReceived = format(received);
  const formatedExpected = format(expected);
  const pass = `${formatedExpected}` === `${formatedReceived}`;

  const message = pass
    ? () =>
        `${matcherHint('.not.toBeFormated', received)}\n\n` +
        `Expected:\n  ${receivedColor(received)}\n` +
        `Not to be equal to:\n  ${printExpected(expected)}\n`
    : () =>
        `${matcherHint('.toBeFormated', formatedReceived)}\n\n` +
        `Expected:\n  ${receivedColor(formatedReceived)}\n` +
        `To be equal to:\n  ${printExpected(formatedExpected)}\n`;

  return {pass, message};
}

expect.extend({
  toBeFormated,
});

export {};

function format(str: string) {
  return (
    str
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // outdent
      .replace(/(^\s+|\s+$)/g, '')
      // replace line breaks
      .replace(/(\r\n|\n|\r)/gm, '')
      // replace spaces in curly braces
      .replace(/{ /g, '{')
      .replace(/ }/g, '}')
      // replace double with single quotes
      .replace(/"/g, `'`)
  );
}
