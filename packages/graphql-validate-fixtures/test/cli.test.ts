import {resolve} from 'path';
import {execSync} from 'child_process';
import {stripFullFilePaths} from '../../../test/utilities';

const scriptPath = resolve(__dirname, '../bin/graphql-validate-fixtures');
const rootFixturePath = resolve(__dirname, 'fixtures');

describe('cli', () => {
  it('succeeds when there are no fixture errors', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('all-clear')),
    ).not.toThrowError();
  });

  it('fails when there are fixture errors', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('fixture-errors')),
    ).toThrowErrorMatchingSnapshot();
  });

  it('fails when there are syntax errors', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('fixture-invalid')),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      exec(cliCommandForFixtureDirectory('malformed-query')),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      exec(cliCommandForFixtureDirectory('missing-schema')),
    ).toThrowErrorMatchingSnapshot();
  });

  it('hides passing fixtures by default', () => {
    expect(
      execSync(cliCommandForFixtureDirectory('all-clear')).toString(),
    ).toMatchSnapshot();
  });

  it('shows passes fixtures when the show-passes flag is true', () => {
    const showPasses = true;
    expect(
      execSync(
        cliCommandForFixtureDirectory('all-clear', showPasses),
      ).toString(),
    ).toMatchSnapshot();
  });
});

function exec(command: string) {
  try {
    const result = execSync(command);
    return stripFullFilePaths(result);
  } catch (error) {
    error.message = stripFullFilePaths(error.message);
    throw error;
  }
}

function cliCommandForFixtureDirectory(fixture: string, showPasses = false) {
  const fixtureDirectory = resolve(rootFixturePath, fixture);
  return [
    scriptPath,
    `'${resolve(fixtureDirectory, 'fixtures/**/*.json')}'`,
    `--schema-path '${resolve(fixtureDirectory, 'schema.json')}'`,
    `--operation-paths '${resolve(fixtureDirectory, 'queries/**/*.graphql')}'`,
    showPasses ? `--show-passes` : '',
  ]
    .join(' ')
    .trim();
}
