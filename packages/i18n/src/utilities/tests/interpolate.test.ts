import {DEFAULT_FORMAT} from '../interpolate';

describe('DEFAULT_FORMAT', () => {
  it.each([
    // Matches
    ['{foo}', ['foo']],
    ['{f}', ['f']],
    ['{{foo}}', ['foo']],
    ['test {foo }', ['foo']],
    ['{ foo} test', ['foo']],
    ['test {     foo   } test', ['foo']],
    ['test {foo} test {bar}', ['foo', 'bar']],
    // No matches
    ['{}', []],
    ['{     }', []],
    ['{ test {}', []],
  ])('matches "%s" with keys %p', (input, keys) => {
    expect.assertions(keys.length);
    Array.from(input.matchAll(DEFAULT_FORMAT)).forEach(
      ([_, key], matchIndex) => {
        expect(key).toBe(keys[matchIndex]);
      },
    );
  });
});
