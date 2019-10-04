import * as path from 'path';

import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import FetchCompileWasmTemplatePlugin from 'webpack/lib/web/FetchCompileWasmTemplatePlugin';

import {WebWorkerPlugin} from './plugin';

const NAME = 'WebWorker';

export function pitch(
  this: import('webpack').loader.LoaderContext,
  request: string,
) {
  this.cacheable(false);
  const callback = this.async();

  const {
    context,
    resourcePath,
    _compiler: compiler,
    _compilation: compilation,
  } = this;

  // if (compiler.options.output.globalObject !== 'self') {
  //   return callback(
  //     new Error(
  //       'webpackConfig.output.globalObject is not set to "self", which will cause chunk loading in the worker to fail. Please change the value to "self" for any builds targeting the browser.',
  //     ),
  //   );
  // }

  const plugin: WebWorkerPlugin = (compiler.options.plugins || []).find(
    WebWorkerPlugin.isInstance,
  ) as any;

  const virtualModule = path.join(
    path.dirname(resourcePath),
    `${path.basename(resourcePath, path.extname(resourcePath))}.worker.js`,
  );

  plugin.virtualModules.writeModule(
    virtualModule,
    `
      import * as api from ${JSON.stringify(request)};
      import {expose} from '@shopify/web-workers';

      expose(api);
    `,
  );

  const workerOptions = {
    filename: addWorkerSubExtension(compiler.options.output!.filename!),
    chunkFilename: addWorkerSubExtension(
      compiler.options.output!.chunkFilename!,
    ),
    globalObject: (plugin && plugin.options.globalObject) || 'self',
  };

  const workerCompiler: import('webpack').Compiler = compilation.createChildCompiler(
    NAME,
    workerOptions,
    (plugin && plugin.options.plugins) || [],
  );

  (workerCompiler as any).context = (compiler as any).context;

  new WebWorkerTemplatePlugin({}).apply(workerCompiler);
  new FetchCompileWasmTemplatePlugin({
    mangleImports: (compiler.options.optimization! as any).mangleWasmImports,
  }).apply(workerCompiler);
  new SingleEntryPlugin(context, virtualModule, 'worker').apply(workerCompiler);

  const subCache = `subcache ${__dirname} ${request}`;
  workerCompiler.hooks.compilation.tap(NAME, compilation => {
    if (!compilation.cache) {
      return;
    }

    if (!compilation.cache[subCache]) {
      compilation.cache[subCache] = {};
    }

    compilation.cache = compilation.cache[subCache];
  });

  (workerCompiler as any).runAsChild(
    (
      error: Error | null,
      entries: {files: string[]}[] | null,
      compilation: import('webpack').compilation.Compilation,
    ) => {
      let finalError;

      if (!error && compilation.errors && compilation.errors.length) {
        finalError = compilation.errors[0];
      }
      const entry = entries && entries[0] && entries[0].files[0];

      if (!finalError && !entry) {
        finalError = new Error(`WorkerPlugin: no entry for ${request}`);
      }

      if (finalError) {
        return callback!(finalError);
      }

      return callback!(
        null,
        `export default __webpack_public_path__ + ${JSON.stringify(entry)};`,
      );
    },
  );
}

function addWorkerSubExtension(file: string) {
  return file.replace(/\.([a-z]+)$/i, '.worker.$1');
}

const loader = {
  pitch,
};

export default loader;
