import {resolve} from 'path';
import {remove, existsSync} from 'fs-extra';
import {yarnInstall, runBuild} from './utilites';

const fixture = resolve(__dirname, 'app-fixture');

const build = resolve(fixture, 'build');
const client = resolve(build, 'client');
const manifest = resolve(client, 'async-chunks.json');

describe('build', () => {
  beforeAll(() => {
    yarnInstall(fixture);
  }, 60000);

  afterAll(async () => {
    await remove(build);
    await remove(resolve(fixture, 'node_modules'));
  });

  it('should generate a async-chunks.json manifest after build', () => {
    runBuild(fixture);
    expect(existsSync(manifest)).toBe(true);
  });
});
