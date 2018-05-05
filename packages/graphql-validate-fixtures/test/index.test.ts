import * as glob from 'glob';
import {join} from 'path';
import {stripFullFilePaths} from '../../../test/utilities';
import {evaluateFixtures, Options} from '../src';

const rootFixtureDirectory = join(__dirname, 'fixtures');

describe('evaluateFixtures()', () => {
  it('handles fixtures without errors', async () => {
    expect(await evaluateFixturesForFixturePath('all-clear')).toMatchSnapshot();
  });

  it('handles fixtures with errors', async () => {
    expect(
      await evaluateFixturesForFixturePath('fixture-errors'),
    ).toMatchSnapshot();
  });

  it('handles fixtures that are invalid json', async () => {
    expect(
      await evaluateFixturesForFixturePath('fixture-invalid'),
    ).toMatchSnapshot();
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

  describe('schemaOnly', () => {
    it('validates against the schema only', async () => {
      expect(
        await evaluateFixturesForFixturePath('fixture-errors', {
          schemaOnly: true,
        }),
      ).toMatchSnapshot();
    });

    it('does not fail on malformed GraphQL documents', async () => {
      expect(
        await evaluateFixturesForFixturePath('malformed-query', {
          schemaOnly: true,
        }),
      ).toMatchSnapshot();
    });
  });
});

async function evaluateFixturesForFixturePath(
  fixture: string,
  options?: Options,
) {
  try {
    const result = await evaluateFixtures(detailsForFixture(fixture), options);
    return stripFullFilePaths(result);
  } catch (error) {
    throw stripFullFilePaths(error);
  }
}

function detailsForFixture(fixture: string) {
  const fixtureDirectory = join(rootFixtureDirectory, fixture);
  const schemaPath = join(fixtureDirectory, 'schema.json');
  const fixturePaths = glob.sync(join(fixtureDirectory, 'fixtures/**/*.json'));
  const operationPaths = glob.sync(
    join(fixtureDirectory, 'queries/**/*.graphql'),
  );

  return {
    schemaPath,
    fixturePaths,
    operationPaths,
  };
}
