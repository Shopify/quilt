/* eslint-disable @shopify/jest/no-snapshots */
import {join} from 'path';

import * as glob from 'glob';

import {stripFullFilePaths} from '../../../tests/utilities';
import type {Options} from '../src/index';
import {evaluateFixtures} from '../src/index';

const rootFixtureDirectory = join(__dirname, 'fixtures');

describe('evaluateFixtures()', () => {
  it('handles fixtures without errors', async () => {
    expect(await evaluateFixturesForFixturePath('all-clear')).toMatchSnapshot();
  });

  it('handles multi-project fixtures without errors', async () => {
    expect(
      await evaluateFixturesForFixturePath('multi-project'),
    ).toMatchSnapshot();
  });

  it('handles ambiguous operation names in multi-project fixtures with errors', async () => {
    expect(
      await evaluateFixturesForFixturePath('ambiguous-operation'),
    ).toMatchSnapshot();
  });

  it('handles missing operation names in multi-project fixtures with errors', async () => {
    expect(
      await evaluateFixturesForFixturePath('missing-operation'),
    ).toMatchSnapshot();
  });

  it('handles fixtures with errors', async () => {
    expect(
      await evaluateFixturesForFixturePath('fixture-errors'),
    ).toMatchSnapshot();
  });

  it('handles fixtures that are invalid json', async () => {
    const result = await evaluateFixturesForFixturePath('fixture-invalid');
    expect(result[0]).toStrictEqual(
      expect.objectContaining({
        fixturePath:
          'packages/graphql-validate-fixtures/tests/fixtures/fixture-invalid/fixtures/another-fixture.json',
        scriptError: expect.objectContaining({
          message: expect.stringContaining('JSON at position 35'),
        }),
        validationErrors: [],
      }),
    );
  });

  it('throws an error when the schema is not found', async () => {
    await expect(
      evaluateFixturesForFixturePath('missing-schema'),
    ).rejects.toMatchSnapshot();
  });

  it('throws an error when there are malformed GraphQL documents', async () => {
    await expect(
      evaluateFixturesForFixturePath('malformed-query'),
    ).rejects.toMatchSnapshot();
  });
});

async function evaluateFixturesForFixturePath(
  fixture: string,
  options?: Partial<Options>,
) {
  try {
    const result = await evaluateFixtures(detailsForFixture(fixture), {
      cwd: join(rootFixtureDirectory, fixture),
      ...options,
    });
    return stripFullFilePaths(result);
  } catch (error) {
    throw stripFullFilePaths(error);
  }
}

function detailsForFixture(fixture: string) {
  return glob.sync(join(rootFixtureDirectory, fixture, 'fixtures/**/*.json'));
}

/* eslint-enable @shopify/jest/no-snapshots */
