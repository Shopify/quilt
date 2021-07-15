import * as path from 'path';

import type {LoaderContext, Compilation, Compiler, Chunk} from 'webpack';
import {EntryPlugin, webworker, web} from 'webpack';

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

  if (compiler == null || compilation == null) {
    return callback(new Error('compiler or compilation is undefined'));
  }

  if (compiler.options.output.globalObject !== 'self') {
    return callback(
      new Error(
        'webpackConfig.output.globalObject is not set to "self", which will cause chunk loading in the worker to fail. Please change the value to "self" for any builds targeting the browser, or set the {noop: true} option on the @shopify/web-worker babel plugin.',
      ),
    );
  }

  const plugin: WebWorkerPlugin | undefined = compiler.options.plugins.find(
    WebWorkerPlugin.isInstance,
  );

  if (plugin == null) {
    return callback(
      new Error(
        'You must also include the WebWorkerPlugin from `@shopify/web-worker` when using the Babel plugin.',
      ),
    );
  }

  const options: Options = this.getOptions();
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
    filename: addWorkerSubExtension(compiler.options.output.filename as string),
    chunkFilename: addWorkerSubExtension(
      compiler.options.output.chunkFilename as string,
    ),
    globalObject: (plugin && plugin.options.globalObject) || 'self',
  };

  const workerCompiler: Compiler = compilation.createChildCompiler(
    NAME,
    workerOptions,
    [],
  );

  workerCompiler.context = compiler.context;

  new webworker.WebWorkerTemplatePlugin().apply(workerCompiler);
  new web.FetchCompileWasmPlugin({
    mangleImports: (compiler.options.optimization! as any).mangleWasmImports,
  }).apply(workerCompiler);
  new EntryPlugin(context, plain ? request : virtualModule, name).apply(
    workerCompiler,
  );

  for (const aPlugin of plugin.options.plugins || []) {
    aPlugin.apply(workerCompiler);
  }

  workerCompiler.runAsChild(
    (error?: Error, entries?: Chunk[], compilation?: Compilation) => {
      let finalError: Error | undefined;

      if (!error && compilation?.errors && compilation.errors.length) {
        finalError = compilation.errors[0];
      }
      const entry = entries && entries[0] && Array.from(entries[0].files)[0];

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
