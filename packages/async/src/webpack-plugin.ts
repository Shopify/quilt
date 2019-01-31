import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import {Compiler, Plugin, compilation} from 'webpack';

export interface Bundle {
  id?: string;
  file: string;
  publicPath: string;
}

export interface Manifest {
  [key: string]: Bundle[];
}

function buildManifest(compilation: compilation.Compilation) {
  const manifest: Manifest = {};

  for (const chunkGroup of compilation.chunkGroups) {
    const files: Bundle[] = [];
    for (const chunk of chunkGroup.chunks) {
      for (const file of chunk.files) {
        const {outputOptions} = compilation;
        const publicPath = url.resolve(outputOptions.publicPath || '', file);
        if (!file.endsWith('.map')) {
          files.push({
            file,
            publicPath,
          });
        }
      }
    }

    for (const block of chunkGroup.blocksIterable) {
      let id = null;

      const dependency =
        block.module == null
          ? null
          : block.module.dependencies.find(
              dep => block.request === dep.request,
            );

      if (dependency) {
        const module = dependency.module;
        id = module.id;
      }

      if (id != null) {
        for (const file of files) {
          file.id = id;
        }

        manifest[id] = files;
      }
    }
  }

  return manifest;
}

export class AsyncPlugin implements Plugin {
  private filename: string;

  constructor({filename = 'async-manifest.json'} = {}) {
    this.filename = filename;
  }

  apply(compiler: Compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const manifest = buildManifest(compilation);
      const json = JSON.stringify(manifest, null, 2);
      const file = path.join(
        compilation.outputOptions.path || '',
        this.filename,
      );
      const outputDirectory = path.dirname(file);

      try {
        fs.mkdirSync(outputDirectory);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }

      fs.writeFileSync(file, json);
      callback();
    });
  }
}
