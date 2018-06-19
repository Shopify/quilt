import * as webpack from 'webpack';
import {join} from 'path';
import {mkdirp, writeFile} from 'fs-extra';
import {resolve as urlResolve} from 'url';

import {calculateBase64IntegrityFromFilename} from './integrity-sha-utils';

export interface BundleDependency {
  file: string;
  publicPath: string;
  chunkName: string;
  integrity?: string | false;
  id?: string;
  name?: string;
}

export interface ReactLoadableMetadata {
  [bundle: string]: BundleDependency[];
}

export class AsyncChunksPlugin implements webpack.Plugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'AsyncChunksPlugin',
      async (compilation, callback) => {
        try {
          const outputDir = compilation.outputOptions.path;
          await mkdirp(outputDir);

          const path = join(outputDir || '', 'react-loadable.json');
          const manifest = generateManifest(compiler, compilation);
          await writeFile(path, JSON.stringify(manifest, null, 2));
        } catch (err) {
          compilation.errors.push(err);
        } finally {
          callback();
        }
      },
    );
  }
}

function generateManifest(compiler, compilation) {
  const manifest: ReactLoadableMetadata = {};
  const {context, mode} = compiler.options;

  for (const chunkGroup of compilation.chunkGroups) {
    const files: BundleDependency[] = [];
    for (const chunk of chunkGroup.chunks) {
      for (const file of chunk.files) {
        const {outputOptions} = compilation;
        const publicPath = urlResolve(outputOptions.publicPath || '', file);
        if (!file.endsWith('.map')) {
          const {hashFunction, hashDigest} = outputOptions;

          const integrity =
            mode === 'production' &&
            calculateBase64IntegrityFromFilename(
              file,
              hashFunction,
              hashDigest,
            );

          files.push({
            file,
            publicPath,
            chunkName: chunk.name,
            ...(integrity ? {integrity} : {}),
          });
        }
      }
    }

    for (const block of chunkGroup.blocksIterable) {
      let name;
      let id;
      const dependency = block.module.dependencies.find(
        (dep: any) => block.request === dep.request,
      );

      if (dependency) {
        const module = dependency.module;
        id = module.id;
        name =
          typeof module.libIdent === 'function'
            ? module.libIdent({context})
            : null;
      }

      for (const file of files) {
        file.id = id;
        file.name = name;
      }

      manifest[block.request] = files;
    }
  }

  return manifest;
}
