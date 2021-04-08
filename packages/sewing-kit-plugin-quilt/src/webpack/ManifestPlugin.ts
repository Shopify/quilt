import {join, dirname, extname} from 'path';

import {mkdirp, writeFile} from 'fs-extra';
import type {Compiler, Plugin, compilation} from 'webpack';
import type {Manifest, ManifestEntry} from '@quilted/async/assets';

interface Options {
  id: string;
  match: Manifest['match'];
  default: boolean;
}

export class ManifestPlugin implements Plugin {
  constructor(private readonly options: Options) {}

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'AssetManifestPlugin',
      async (compilation, callback) => {
        try {
          const file = join(
            compilation.outputOptions.path ?? '',
            `${this.options.id}.manifest.json`,
          );
          await mkdirp(dirname(file));
          await writeFile(
            file,
            JSON.stringify(
              manifestFromCompilation(compilation, this.options),
              null,
              2,
            ),
          );
        } catch (err) {
          compilation.errors.push(err);
        } finally {
          callback();
        }
      },
    );
  }
}

function manifestFromCompilation(
  compilation: compilation.Compilation,
  manifest: Pick<Manifest, 'id' | 'match' | 'default'>,
): Manifest {
  return {
    ...manifest,
    entries: entriesFromCompilation(compilation),
    async: getAsyncAssetManifest(compilation),
  };
}

function entriesFromCompilation(compilation: compilation.Compilation) {
  return [...compilation.entrypoints.keys()].reduce<{
    [key: string]: ManifestEntry;
  }>(
    (entries, name) => ({
      ...entries,
      [name]: getChunkDependencies(compilation, name),
    }),
    {},
  );
}

// Supported algorithms listed in the spec: https://w3c.github.io/webappsec-subresource-integrity/#hash-functions
export const SRI_HASH_ALGORITHMS = ['sha256', 'sha384', 'sha512'];

function calculateBase64IntegrityFromFilename(
  path: string,
  hashFunction: string,
  hashDigest: string,
): string | false {
  if (!isHashAlgorithmSupportedByBrowsers(hashFunction)) {
    return false;
  }
  if (hashDigest && hashDigest !== 'hex') {
    return false;
  }

  const chunkInfo =
    // Anything ending in a hyphen + hex string (e.g., `foo-00000000.js`).
    path.match(/.+?-(?:([a-f0-9]+))?\.[^.]+$/) ||
    // Unnamed dynamic imports like `00000000.js`.
    path.match(/^([a-f0-9]+)\.[^.]+$/);

  if (!chunkInfo || !chunkInfo[1]) {
    return false;
  }

  const hexHash = chunkInfo[1];
  const base64Hash = Buffer.from(hexHash, 'hex').toString('base64');
  return `${hashFunction}-${base64Hash}`;
}

function isHashAlgorithmSupportedByBrowsers(hashFunction: string) {
  return SRI_HASH_ALGORITHMS.includes(hashFunction);
}

const EXTENSION_MAP = new Map<string, keyof ManifestEntry>([
  ['css', 'styles'],
  ['js', 'scripts'],
]);

function getChunkDependencies(
  {entrypoints, outputOptions}: compilation.Compilation,
  entryName: string,
): ManifestEntry {
  const {publicPath = '', hashFunction, hashDigest} = outputOptions;
  const dependencyChunks: string[] = entrypoints.get(entryName).chunks;
  const allChunkFiles = dependencyChunks.reduce(
    (allFiles: string[], depChunk: any) => [...allFiles, ...depChunk.files],
    [],
  );

  const dependencies: ManifestEntry = {styles: [], scripts: []};
  allChunkFiles.forEach((path) => {
    const extension = extname(path).replace('.', '');
    if (!EXTENSION_MAP.has(extension)) {
      return;
    }

    const integrity = calculateBase64IntegrityFromFilename(
      path,
      hashFunction,
      hashDigest,
    );

    dependencies[EXTENSION_MAP.get(extension)!].push({
      path: `${publicPath}${path}`,
      ...(integrity ? {integrity} : {}),
    });
  });

  return dependencies;
}

function getAsyncAssetManifest(
  compilation: compilation.Compilation,
  {includeIntegrity = true} = {},
) {
  const {hashFunction, hashDigest, publicPath = ''} = compilation.outputOptions;
  const asyncManifest: Manifest['async'] = {};

  for (const chunkGroup of compilation.chunkGroups) {
    const entry: ManifestEntry = {styles: [], scripts: []};

    for (const chunk of chunkGroup.chunks) {
      for (const file of chunk.files) {
        const extension = extname(file).replace('.', '');

        if (!EXTENSION_MAP.has(extension)) continue;

        const integrity =
          includeIntegrity &&
          calculateBase64IntegrityFromFilename(file, hashFunction, hashDigest);

        const fileIntegrity = integrity ? {integrity} : {};

        entry[EXTENSION_MAP.get(extension)!].push({
          path: `${
            publicPath.endsWith('/') ? publicPath.slice(0, -1) : publicPath
          }/${file.startsWith('/') ? file.slice(1) : file}`,
          ...fileIntegrity,
        });
      }
    }

    for (const block of chunkGroup.blocksIterable) {
      const dependency = block.module?.dependencies.find(
        (dep: {request: string}) => block.request === dep.request,
      );

      const id = dependency?.module.id;

      if (id != null) {
        asyncManifest[id] = entry;
      }
    }
  }

  return asyncManifest;
}
