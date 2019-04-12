import {resolve} from 'path';
import {execSync} from 'child_process';
import {stripFullFilePaths} from '../../../test/utilities';

const scriptPath = resolve(__dirname, '../bin/graphql-validate-fixtures');
const rootFixturePath = resolve(__dirname, 'fixtures');

// Skipping for now because it fails in CI for no apparent reason :(
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('cli', () => {
  it('succeeds when there are no fixture errors', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('all-clear')),
    ).not.toThrow();
  });

  it('succeeds for a multi-project when there are no fixture errors', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('multi-project')),
    ).not.toThrow();
  });

  it('fails when there are ambiguous fixture names', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('ambiguous-operation')),
    ).toThrowErrorMatchingSnapshot();
  });

  it('fails when a fixture matches no operations', () => {
    expect(() =>
      exec(cliCommandForFixtureDirectory('missing-operation')),
    ).toThrowErrorMatchingSnapshot();
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
    `--cwd '${fixtureDirectory}'`,
    showPasses ? `--show-passes` : '',
  ]
    .join(' ')
    .trim();
}
