import AsyncChunks, {clearCache, defaultManifest} from '../async-chunks';
import manifest from './fixtures/manifest';

const manifestPath = '../somePath/someManifest.json';

jest.mock('fs-extra', () => ({
  readJSON: jest.fn(() =>
    Promise.resolve(require('./fixtures/manifest').default),
  ),
}));

const readJSON: jest.Mock = require.requireMock('fs-extra').readJSON;

describe('AsyncChunks', () => {
  beforeEach(() => {
    readJSON.mockClear();
    clearCache();
  });

  it('#chunks returns an empty set for scripts and styles when no modules are passed in', async () => {
    const asyncChunks = new AsyncChunks();
    const {scripts, styles} = await asyncChunks.chunks([]);

    expect(scripts).toEqual(new Set());
    expect(styles).toEqual(new Set());
  });

  it('#chunks returns an empty set for scripts and styles and the moduleId is not in manifest', async () => {
    const asyncChunks = new AsyncChunks();
    const {scripts, styles} = await asyncChunks.chunks(['./notInManifest']);

    expect(scripts).toEqual(new Set());
    expect(styles).toEqual(new Set());
  });

  it('#chunks returns productIndex chunks when ./productIndex the moduleId is passed', async () => {
    const asyncChunks = new AsyncChunks();
    const {scripts, styles} = await asyncChunks.chunks(['./productIndex']);
    const productIndex = manifest['./productIndex'];
    const scriptChunk = productIndex.filter(bundle =>
      bundle.publicPath.endsWith('.js'),
    )[0];
    const styleChunk = productIndex.filter(bundle =>
      bundle.publicPath.endsWith('.css'),
    )[0];

    expect(scripts).toEqual(new Set([{path: scriptChunk.publicPath}]));
    expect(styles).toEqual(new Set([{path: styleChunk.publicPath}]));
  });

  it('#getAsyncChunksManifest uses the default manifest directory', async () => {
    const asyncChunks = new AsyncChunks();
    await asyncChunks.getAsyncChunksManifest();
    expect(readJSON).toHaveBeenCalledWith(defaultManifest);
  });

  it('#getAsyncChunksManifest uses the specified manifest', async () => {
    const asyncChunks = new AsyncChunks(manifestPath);
    await asyncChunks.getAsyncChunksManifest();
    expect(readJSON).toHaveBeenCalledWith(manifestPath);
  });

  it('#getAsyncChunksManifest only reads the async assets manifest file once', async () => {
    const asyncChunks = new AsyncChunks(manifestPath);
    await asyncChunks.getAsyncChunksManifest();
    await asyncChunks.getAsyncChunksManifest();

    expect(readJSON).toHaveBeenCalledWith(manifestPath);
    expect(readJSON).toHaveBeenCalledTimes(1);
  });

  it('#getAsyncChunksManifest throws an error when the manifest does not exist', async () => {
    readJSON.mockImplementation(() => {
      throw new Error();
    });

    const asyncChunks = new AsyncChunks(manifestPath);
    await expect(asyncChunks.getAsyncChunksManifest()).rejects.toThrowError(
      `Manifest not found: ${manifestPath}`,
    );
  });
});
