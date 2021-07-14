import * as path from 'path';

import type {LoaderContext, Compilation, Compiler} from 'webpack';
import webpack from 'webpack';

import {WebWorkerPlugin} from './plugin';

const NAME = 'WebWorker';

export interface Options {
  name?: string;
  plain?: boolean;
}

export function pitch(this: LoaderContext<Options>, request: string) {
  this.cacheable(false);
  const callback = this.async();

  const {
    context,
    resourcePath,
    _compiler: compiler,
    _compilation: compilation,
  } = this;

  if (compiler!.options.output!.globalObject !== 'self') {
    return callback!(
      new Error(
        'webpackConfig.output.globalObject is not set to "self", which will cause chunk loading in the worker to fail. Please change the value to "self" for any builds targeting the browser, or set the {noop: true} option on the @shopify/web-worker babel plugin.',
      ),
    );
  }

  const plugin: WebWorkerPlugin = (compiler!.options.plugins || []).find(
    WebWorkerPlugin.isInstance,
  ) as any;

  if (plugin == null) {
    throw new Error(
      'You must also include the WebWorkerPlugin from `@shopify/web-worker` when using the Babel plugin.',
    );
  }

  const options: Options = (this.query as Options) || {};
  const {name = String(plugin.workerId++), plain = false} = options;

  const virtualModule = path.join(
    path.dirname(resourcePath),
    `${path.basename(resourcePath, path.extname(resourcePath))}.worker.js`,
  );

  if (!plain) {
    plugin.virtualModules.writeModule(
      virtualModule,
      `
        import * as api from ${JSON.stringify(request)};
        import {expose} from '@shopify/web-worker/worker';

        expose(api);
      `,
    );
  }

  const workerOptions = {
    filename: addWorkerSubExtension(
      compiler!.options.output!.filename as string,
    ),
    chunkFilename: addWorkerSubExtension(
      compiler!.options.output!.chunkFilename as string,
    ),
    globalObject: (plugin && plugin.options.globalObject) || 'self',
  };

  const workerCompiler: Compiler = compilation!.createChildCompiler(
    NAME,
    workerOptions,
    [],
  );

  (workerCompiler as any).context = (compiler as any).context;

  new webpack.webworker.WebWorkerTemplatePlugin().apply(workerCompiler);
  new webpack.web.FetchCompileWasmPlugin({
    mangleImports: (compiler!.options.optimization! as any).mangleWasmImports,
  }).apply(workerCompiler);
  new webpack.SingleEntryPlugin(
    context,
    plain ? request : virtualModule,
    name,
  ).apply(workerCompiler);

  for (const aPlugin of plugin.options.plugins || []) {
    aPlugin.apply(workerCompiler);
  }

  const subCache = `subcache ${__dirname} ${request}`;

  workerCompiler.hooks.compilation.tap(NAME, (compilation) => {
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
      compilation: Compilation,
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
