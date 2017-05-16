import * as glob from 'glob';
import {join} from 'path';
import {evaluateFixtures} from '../src';

const rootFixtureDirectory = join(__dirname, 'fixtures');

describe('evaluateFixtures()', () => {
  it('handles fixtures without errors', async () => {
    expect(await evaluateFixturesForFixturePath('all-clear')).toMatchSnapshot();
  });

  it('handles fixtures with errors', async () => {
    expect(await evaluateFixturesForFixturePath('fixture-errors')).toMatchSnapshot();
  });

  it('handles fixtures that are invalid json', async () => {
    expect(await evaluateFixturesForFixturePath('fixture-invalid')).toMatchSnapshot();
  });

  it('throws an error when the schema is not found', async () => {
    const details = detailsForFixture('missing-schema');
    details.schemaPath += 'foo';
    await expect(evaluateFixtures(details)).rejects.toMatchSnapshot();
  });

  it('throws an error when there are malformed GraphQL documents', async () => {
    await expect(evaluateFixturesForFixturePath('malformed-query')).rejects.toMatchSnapshot();
  });
});

function evaluateFixturesForFixturePath(fixture: string) {
  return evaluateFixtures(detailsForFixture(fixture));
}

function detailsForFixture(fixture: string) {
  const fixtureDirectory = join(rootFixtureDirectory, fixture);
  const schemaPath = join(fixtureDirectory, 'schema.json');
  const fixturePaths = glob.sync(join(fixtureDirectory, 'fixtures/**/*.json'));
  const operationPaths = glob.sync(join(fixtureDirectory, 'queries/**/*.graphql'));

  return {
    schemaPath,
    fixturePaths,
    documentPaths: operationPaths,
  };
}
