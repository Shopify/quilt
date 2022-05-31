import {DEFAULT_FORMAT, ERB_FORMAT, MUSTACHE_FORMAT} from '../interpolate';

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

describe('MUSTACHE_FORMAT', () => {
  it.each([
    // Matches
    ['{{foo}}', ['foo']],
    ['{{f}}', ['f']],
    ['test {{foo }}', ['foo']],
    ['{{ foo}} test', ['foo']],
    ['{{{foo}}} test', ['foo']],
    ['test {{     foo   }} test', ['foo']],
    ['test {{foo}} test {{bar}}', ['foo', 'bar']],
    // No matches
    ['{{}}', []],
    ['{{   }}', []],
    ['{{ {foo}}} test', []],
    ['{{ foo{ }}', []],
    ['{{foo}', []],
    ['{foo}}', []],
    ['{foo}', []],
  ])('matches "%s" with keys %p', (input, keys) => {
    expect.assertions(keys.length);
    Array.from(input.matchAll(MUSTACHE_FORMAT)).forEach(
      ([_, key], matchIndex) => {
        expect(key).toBe(keys[matchIndex]);
      },
    );
  });
});

describe('ERB_FORMAT', () => {
  it.each([
    // Matches
    ['<%= foo %>', ['foo']],
    ['<%= f %>', ['f']],
    ['test <%= foo  %>', ['foo']],
    ['<%=  foo %> test', ['foo']],
    ['test <%=      foo    %> test', ['foo']],
    ['test <%= foo %> test <%= bar %>', ['foo', 'bar']],
    // No matches
    ['<%=foo%>', []],
    ['<%= %>', []],
    ['<%= foo%>', []],
    ['<%= foo% %>', []],
    ['<% foo %>', []],
    ['<%= foo %%>', []],
  ])('matches "%s" with keys %p', (input, keys) => {
    expect.assertions(keys.length);
    Array.from(input.matchAll(ERB_FORMAT)).forEach(([_, key], matchIndex) => {
      expect(key).toBe(keys[matchIndex]);
    });
  });
});
