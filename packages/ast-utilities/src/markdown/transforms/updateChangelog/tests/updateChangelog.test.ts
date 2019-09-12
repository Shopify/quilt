import {transform} from '../../../transform';
import updateChangelog from '../updateChangelog';

describe('transform', () => {
  it('updateChangelog()', async () => {
    const newVersion = '0.0.2';
    const newDate = '2019-09-16';

    const initial = `
## Unreleased

## 0.0.1 - 2019-08-15

-   updated a thing
    `;

    const expected = `
<!-- ## Unreleased -->

## ${newVersion} - ${newDate}

-   related @shopify dependency version numbers changed

## 0.0.1 - 2019-08-15

-   updated a thing
    `.trim();

    const result = await transform(
      initial,
      updateChangelog({version: newVersion, date: newDate}),
    );

    expect(result).toBeFormated(expected);
  });
});
