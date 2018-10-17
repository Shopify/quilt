import {ChunkDependency} from '@shopify/async-chunks/server';
import {resolve} from 'path';
import {remove, existsSync, readJsonSync} from 'fs-extra';
import {yarnInstall, runBuild} from './utilites';

const fixture = resolve(__dirname, 'app-fixture');

const build = resolve(fixture, 'build');
const client = resolve(build, 'client');
const manifest = resolve(client, 'async-chunks.json');

function getManifestChunks(manifest, chunk: string): ChunkDependency[] {
  return readJsonSync(manifest)[chunk];
}

describe('async chunks manifest', () => {
  beforeAll(() => {
    yarnInstall(fixture);
  }, 60000);

  afterAll(async () => {
    await remove(build);
    await remove(resolve(fixture, 'node_modules'));
  });

  afterEach(async () => {
    await remove(build);
  });

  it('generates a async-chunks.json in the client build dir', () => {
    runBuild(fixture);
    expect(existsSync(manifest)).toBe(true);
  });

  describe('sections/Home', () => {
    it('includes css chunk', () => {
      runBuild(fixture);

      const bundles = getManifestChunks(manifest, 'sections/Home');
      expect(bundles).toHaveLength(2);
      expect(bundles[0]).toMatchObject({
        file: expect.stringMatching(/^homeChunk-[a-f0-9]{64}.css$/),
        publicPath: expect.stringMatching(
          /^http:\/\/localhost:8080\/webpack\/assets\/homeChunk-[a-f0-9]{64}.css$/,
        ),
        chunkName: 'homeChunk',
        integrity: expect.stringMatching(/sha256-.{44}$/),
      });
    });
    it('includes js chunk', () => {
      runBuild(fixture);

      const bundles = getManifestChunks(manifest, 'sections/Home');
      expect(bundles).toHaveLength(2);
      expect(bundles[1]).toMatchObject({
        file: expect.stringMatching(/^homeChunk-[a-f0-9]{64}.js$/),
        publicPath: expect.stringMatching(
          /^http:\/\/localhost:8080\/webpack\/assets\/homeChunk-[a-f0-9]{64}.js$/,
        ),
        chunkName: 'homeChunk',
        integrity: expect.stringMatching(/sha256-.{44}$/),
      });
    });
  });
});
