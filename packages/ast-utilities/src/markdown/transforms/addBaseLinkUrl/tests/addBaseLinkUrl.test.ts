import {transform} from '../../../transform';
import addBaseLinkUrl from '../addBaseLinkUrl';

describe('addBaseLinkUrl', () => {
  it('adds a base to url paths', async () => {
    const base = 'https://shopify.dev';
    const initial = `This is a sentence [this is a relative link](/path/to/dir).`;
    const result = await transform(initial, addBaseLinkUrl(base));

    expect(format(result.toString())).toBe(
      format(
        `This is a sentence [this is a relative link](https://shopify.dev/path/to/dir).`,
      ),
    );
  });

  it('does not transform absolute URLs', async () => {
    const base = 'https://shopify.dev';
    const initial = `This is a sentence [this is an absolute link](https://www.shopify.com).`;
    const result = await transform(initial, addBaseLinkUrl(base));

    expect(format(result.toString())).toBe(format(initial));
  });

  it('does not transform a relative paths', async () => {
    const base = 'https://shopify.dev';
    const initial = `This is a sentence [this is a relative link with leading dot dots](../../path/to/dir).`;
    const result = await transform(initial, addBaseLinkUrl(base));

    expect(format(result.toString())).toBe(format(initial));
  });

  it('supports multiple links', async () => {
    const base = 'https://shopify.dev';
    const initial = `
This is a sentence [this is a relative link with leading dot dots](../../path/to/dir).

This is a sentence [this is a relative link](/path/to/dir).

- This is a sentence [this is an absolute link](https://www.shopify.com).
- This is a sentence [this is a relative link with leading dot dots](../../path/to/dir).
- This is a sentence [this is a relative link](/path/to/dir).
`;
    const result = await transform(initial, addBaseLinkUrl(base));

    expect(format(result.toString())).toBe(
      format(`
This is a sentence [this is a relative link with leading dot dots](../../path/to/dir).

This is a sentence [this is a relative link](https://shopify.dev/path/to/dir).

- This is a sentence [this is an absolute link](https://www.shopify.com).
- This is a sentence [this is a relative link with leading dot dots](../../path/to/dir).
- This is a sentence [this is a relative link](https://shopify.dev/path/to/dir).
    `),
    );
  });
});

function format(str: string) {
  return (
    str
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
