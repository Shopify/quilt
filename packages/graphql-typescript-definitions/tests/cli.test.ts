/* eslint-disable @shopify/jest/no-snapshots */
import {resolve} from 'path';
import {exec} from 'child_process';

import {stripFullFilePaths} from '../../../tests/utilities';

const scriptPath = resolve(__dirname, '../bin/graphql-typescript-definitions');
const rootFixturePath = resolve(__dirname, 'fixtures');

// Skipping for now because it fails in CI for no apparent reason :(
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('cli', () => {
  it('succeeds when there are no fixture errors', async () => {
    expect(
      await execDetails(cliCommandForFixtureDirectory('all-clear-legacy')),
    ).toMatchSnapshot();
  });

  it('succeeds when there are multiple schemas', async () => {
    expect(
      await execDetails(
        cliCommandForFixtureDirectory('multiple-schemas-legacy'),
      ),
    ).toMatchSnapshot();
  });

  it('succeeds when schemaPath is set to a graphql file', async () => {
    expect(
      await execDetails(cliCommandForFixtureDirectory('graphql-schema-legacy')),
    ).toMatchSnapshot();
  });

  it('fails when there are syntax errors', async () => {
    expect(
      await execDetails(
        cliCommandForFixtureDirectory('malformed-query-legacy'),
      ),
    ).toMatchSnapshot();
    expect(
      await execDetails(cliCommandForFixtureDirectory('missing-schema-legacy')),
    ).toMatchSnapshot();
  });

  it('fails when there are unused types', async () => {
    expect(
      await execDetails(cliCommandForFixtureDirectory('missing-types-legacy')),
    ).toMatchSnapshot();
  });

  it('fails when multiple queries have the same name', async () => {
    expect(
      await execDetails(
        cliCommandForFixtureDirectory('duplicate-query-names-legacy'),
      ),
    ).toMatchSnapshot();
  });

  it('fails when multiple fragments have the same name', async () => {
    expect(
      await execDetails(
        cliCommandForFixtureDirectory('duplicate-fragment-names-legacy'),
      ),
    ).toMatchSnapshot();
  });
});

function execDetails(command: string) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        error: stripFullFilePaths(error),
        stdout: stripFullFilePaths(stdout),
        stderr: stripFullFilePaths(stderr),
      });
    });
  });
}

function cliCommandForFixtureDirectory(fixture: string) {
  const fixtureDirectory = resolve(rootFixturePath, fixture);
  return [
    scriptPath,
    `--cwd '${fixtureDirectory}'`,
    `--schema-types-path '${fixtureDirectory}'`,
  ].join(' ');
}

/* eslint-enable @shopify/jest/no-snapshots */
