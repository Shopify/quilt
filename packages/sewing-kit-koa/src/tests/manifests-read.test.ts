import {join} from 'path';

import appRoot from 'app-root-path';
import {gzip} from 'node-gzip';

import {
  internalOnlyClearCache as clearManifestsCache,
  Manifests,
} from '../manifests';

import {
  mockConsolidatedManifest,
  mockEntrypoint,
  mockManifest,
} from './test-utilities';

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  pathExists: jest.fn(() => Promise.resolve(false)),
  readFile: jest.fn(() => '[]'),
  readJson: jest.fn(() => []),
}));

const {pathExists, readFile, readJson} = jest.requireMock('fs-extra');

describe('Manifests read', () => {
  beforeEach(() => {
    pathExists.mockReset();
    pathExists.mockReturnValue(Promise.resolve(false));

    readFile.mockReset();

    readJson.mockReset();
    readJson.mockImplementation(() =>
      mockConsolidatedManifest([
        {entrypoints: {main: mockEntrypoint()}, asyncAssets: {}},
      ]),
    );
  });

  afterEach(() => {
    clearManifestsCache();
  });

  it('prioritizes reading from a gzipped manifests file if it exists', async () => {
    const manifests = new Manifests();
    pathExists.mockReturnValueOnce(Promise.resolve(true));
    readFile.mockReturnValueOnce(
      gzip(
        JSON.stringify(
          mockConsolidatedManifest([
            mockManifest({
              entrypoints: {
                main: mockEntrypoint({}),
              },
            }),
          ]),
        ),
      ),
    );

    await manifests.resolve('Chrome 73');

    expect(readFile).toHaveBeenCalledWith(
      join(appRoot.path, 'build/client/assets.json.gz'),
    );
  });

  it('falls back to reading from a non-gzipped manifests file', async () => {
    const manifests = new Manifests();

    await manifests.resolve('Chrome 73');

    expect(readJson).toHaveBeenCalledWith(
      join(appRoot.path, 'build/client/assets.json'),
    );
  });

  it('only reads manifests once', async () => {
    const manifests = new Manifests();

    await manifests.resolve('Chrome 71');
    await manifests.resolve('Chrome 73');

    expect(readJson).toHaveBeenCalledTimes(1);
  });

  it('reads manifests multiple times when caching is disabled', async () => {
    const path = null;
    const caching = false;
    const manifests = new Manifests(path, caching);

    await manifests.resolve('Chrome 71');
    await manifests.resolve('Chrome 73');

    expect(readJson).toHaveBeenCalledTimes(2);
  });

  it('reads manifests from a custom path', async () => {
    const manifestPath = 'path/to/manifest';
    const manifests = new Manifests(manifestPath);

    await manifests.resolve('Chrome 73');

    expect(pathExists).toHaveBeenCalledWith(
      join(appRoot.path, `${manifestPath}.gz`),
    );
    expect(readJson).toHaveBeenCalledWith(join(appRoot.path, manifestPath));
  });

  it('reads two different manifests', async () => {
    const firstManifestPath = 'path/to/first-manifest';
    const firstManifests = new Manifests(firstManifestPath);
    const secondManifestPath = 'path/to/second-manifest';
    const secondManifests = new Manifests(secondManifestPath);

    await firstManifests.resolve('Chrome 73');

    expect(pathExists).toHaveBeenCalledWith(
      join(appRoot.path, `${firstManifestPath}.gz`),
    );
    expect(readJson).toHaveBeenCalledWith(
      join(appRoot.path, firstManifestPath),
    );

    await secondManifests.resolve('Chrome 73');

    expect(pathExists).toHaveBeenCalledWith(
      join(appRoot.path, `${firstManifestPath}.gz`),
    );
    expect(readJson).toHaveBeenCalledWith(
      join(appRoot.path, firstManifestPath),
    );
  });

  it('does not reads twice the same manifest', async () => {
    const manifestPath = 'path/to/first-manifest';
    const manifests = new Manifests(manifestPath);

    await manifests.resolve('Chrome 73');
    await manifests.resolve('Chrome 73');

    expect(readJson).toHaveBeenNthCalledWith(
      1,
      join(appRoot.path, manifestPath),
    );
  });
});
