import {transform} from '../../../transform';
import addReleaseToChangelog from '../addReleaseToChangelog';

describe('addReleaseToChangelog', () => {
  it('adds a new release version and date', async () => {
    const newVersion = '0.0.2';
    const newDate = '2019-09-16';

    const initial = `
## Unreleased

## 0.0.1 - 2019-08-15

- updated a thing
    `;

    const expected = `
<!-- ## Unreleased -->

## ${newVersion} - ${newDate}

## 0.0.1 - 2019-08-15

- updated a thing
    `.trim();

    const result = await transform(
      initial,
      addReleaseToChangelog({version: newVersion, date: newDate}),
    );

    expect(result).toBeFormated(expected);
  });

  it('adds a release notes when provided as text', async () => {
    const version = '0.0.2';
    const date = '2019-09-16';
    const notes = 'updated another thing';

    const initial = `
## Unreleased

## 0.0.1 - 2019-08-15

- updated a thing
    `;

    const expected = `
<!-- ## Unreleased -->

## ${version} - ${date}

${notes}

## 0.0.1 - 2019-08-15

- updated a thing
    `.trim();

    const result = await transform(
      initial,
      addReleaseToChangelog({version, date, notes}),
    );

    expect(result).toBeFormated(expected);
  });

  it('adds a release notes when provided as a list', async () => {
    const version = '0.0.2';
    const date = '2019-09-16';
    const notes = `
- updated another thing
- updated and a final thing
		`;

    const initial = `
## Unreleased

## 0.0.1 - 2019-08-15

- updated a thing
    `;

    const expected = `
<!-- ## Unreleased -->

## ${version} - ${date}

${notes}

## 0.0.1 - 2019-08-15

- updated a thing
    `.trim();

    const result = await transform(
      initial,
      addReleaseToChangelog({version, date, notes}),
    );

    expect(result).toBeFormated(expected);
  });

  it('adds a new release to packages with no changes', async () => {
    const newVersion = '0.0.2';
    const newDate = '2019-09-16';

    const initial = `
<!-- ## Unreleased -->

## 0.0.2 - 2019-08-17

- test updated a package

## 0.0.1 - 2019-08-15

- updated a thing
    `;

    const expected = `
<!-- ## Unreleased -->

## ${newVersion} - ${newDate}

## 0.0.2 - 2019-08-17

- test updated a package

## 0.0.1 - 2019-08-15

- updated a thing
    `.trim();

    const result = await transform(
      initial,
      addReleaseToChangelog({version: newVersion, date: newDate}),
    );

    expect(result).toBeFormated(expected);
  });
});
