import {resolve} from 'path';
import {exec} from 'child_process';

const scriptPath = resolve(__dirname, '../bin/graphql-typescript-definitions');
const rootFixturePath = resolve(__dirname, 'fixtures');

describe('cli', () => {
  it('succeeds when there are no fixture errors', async () => {
    expect(await execDetails(cliCommandForFixtureDirectory('all-clear'))).toMatchSnapshot();
  });

  it('fails when there are syntax errors', async () => {
    expect(await execDetails(cliCommandForFixtureDirectory('malformed-query'))).toMatchSnapshot();
    expect(await execDetails(cliCommandForFixtureDirectory('missing-schema'))).toMatchSnapshot();
  });
});

function execDetails(command: string) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({error, stdout, stderr});
    });
  });
}

function cliCommandForFixtureDirectory(fixture: string) {
  const fixtureDirectory = resolve(rootFixturePath, fixture);
  return [
    scriptPath,
    `'${resolve(fixtureDirectory, 'documents/**/*.graphql')}'`,
    `--schema-path '${resolve(fixtureDirectory, 'schema.json')}'`,
  ].join(' ');
}
