import {transform} from '../../transform';
import replaceStrings from '../replaceStrings';

describe('replaceStrings', () => {
  it('replaces right side string literals', async () => {
    const initial = `foo = "foo";`;

    const result = await transform(initial, replaceStrings([['foo', 'bar']]));

    const expected = `foo = "bar";`;

    expect(result).toBeFormated(expected);
  });

  it('replaces multiple right side string literals', async () => {
    const initial = `
      foo = 'foo';
      bar = 'bar';
    `;

    const result = await transform(
      initial,
      replaceStrings([['foo', 'baz'], ['bar', 'qux']]),
    );

    const expected = `
      foo = 'baz';
      bar = 'qux';
    `;

    expect(result).toBeFormated(expected);
  });
});
