import {resolve} from 'path';
import {execSync} from 'child_process';

const scriptPath = resolve(__dirname, '../bin/graphql-validate-fixtures');
const rootFixturePath = resolve(__dirname, 'fixtures');

describe('cli', () => {
  it('succeeds when there are no fixture errors', () => {
    expect(() => execSync(cliCommandForFixtureDirectory('all-clear'))).not.toThrowError();
  });

  it('fails when there are fixture errors', () => {
    expect(() => execSync(cliCommandForFixtureDirectory('fixture-errors'))).toThrowErrorMatchingSnapshot();
  });

  it('fails when there are syntax errors', () => {
    expect(() => execSync(cliCommandForFixtureDirectory('fixture-invalid'))).toThrowErrorMatchingSnapshot();
    expect(() => execSync(cliCommandForFixtureDirectory('malformed-query'))).toThrowErrorMatchingSnapshot();
    expect(() => execSync(cliCommandForFixtureDirectory('missing-schema'))).toThrowErrorMatchingSnapshot();
  });
});

function cliCommandForFixtureDirectory(fixture: string) {
  const fixtureDirectory = resolve(rootFixturePath, fixture);
  return [
    scriptPath,
    `'${resolve(fixtureDirectory, 'fixtures/**/*.json')}'`,
    `--schema-path '${resolve(fixtureDirectory, 'schema.json')}'`,
    `--operation-paths '${resolve(fixtureDirectory, 'queries/**/*.graphql')}'`,
  ].join(' ');
}
