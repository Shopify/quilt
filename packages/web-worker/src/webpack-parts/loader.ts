import * as path from 'path';

import type {
  LoaderContext,
  Compilation,
  Compiler,
  Chunk,
  PathData,
  AssetInfo,
} from 'webpack';
import {EntryPlugin, webworker, web} from 'webpack';

import {WebWorkerPlugin} from './plugin';

const NAME = 'WebWorker';

const moduleWrapperCache = new Map<string, string | false>();

export interface Options {
  name?: string;
  wrapperModule?: string;
  publicPathGlobalVariable?: string;
}

export function pitch(this: LoaderContext<Options>, request: string) {
  const callback = this.async();
  this.cacheable(false);

  const {
    context,
    resourcePath,
    _compiler: compiler,
    _compilation: compilation,
  } = this;

  if (compiler == null || compilation == null) {
    callback(new Error('compiler or compilation is undefined'));
    return;
  }

  if (compiler.options.output.globalObject !== 'self') {
    callback(
      new Error(
        'webpackConfig.output.globalObject is not set to "self", which will cause chunk loading in the worker to fail. Please change the value to "self" for any builds targeting the browser, or set the {noop: true} option on the @shopify/web-worker babel plugin.',
      ),
    );
    return;
  }

  const plugin: WebWorkerPlugin | undefined = compiler.options.plugins.find(
    WebWorkerPlugin.isInstance,
  );

  if (plugin == null) {
    callback(
      new Error(
        'You must also include the WebWorkerPlugin from `@shopify/web-worker` when using the Babel plugin.',
      ),
    );
    return;
  }

  const options: Options = this.getOptions();
  const {name = String(plugin.workerId++), wrapperModule} = options;

  const virtualModule = path.join(
    path.dirname(resourcePath),
    `${path.basename(resourcePath, path.extname(resourcePath))}.worker.js`,
  );

  let wrapperContent: string | undefined;

  if (wrapperModule) {
    this.addDependency(wrapperModule);
    const cachedContent = moduleWrapperCache.get(wrapperModule);

    if (typeof cachedContent === 'string') {
      wrapperContent = cachedContent;
    } else if (cachedContent == null) {
      try {
        wrapperContent = this.fs.readFileSync(wrapperModule).toString();
        moduleWrapperCache.set(wrapperModule, wrapperContent ?? false);
      } catch (error) {
        moduleWrapperCache.set(wrapperModule, false);
      }
    }
  }

  if (wrapperContent) {
    plugin.virtualModules.writeModule(
      virtualModule,
      wrapperContent.replace('{{WORKER_MODULE}}', JSON.stringify(request)),
    );
  }

  const workerOptions = {
    filename:
      plugin.options.filename ??
      addWorkerSubExtension(compiler.options.output.filename ?? '[name].js'),
    chunkFilename: addWorkerSubExtension(
      compiler.options.output.chunkFilename ?? '[name].js',
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
  new EntryPlugin(
    context,
    wrapperContent === undefined ? request : virtualModule,
    name,
  ).apply(workerCompiler);

  for (const aPlugin of plugin.options.plugins || []) {
    aPlugin.apply(workerCompiler);
  }

  workerCompiler.runAsChild(
    (error: Error | null, entries?: Chunk[], compilation?: Compilation) => {
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

      const publicPathGlobalVariable =
        plugin.options.publicPathGlobalVariable ?? '__webpack_public_path__';
      return callback!(
        null,
        `export default ${publicPathGlobalVariable} + ${JSON.stringify(
          entry,
        )};`,
      );
    },
  );
}

function addWorkerSubExtension(
  file: string | ((pathData: PathData, assetInfo?: AssetInfo) => string),
): string | ((pathData: PathData) => string) {
  if (typeof file === 'function') {
    return (pathData: PathData) => {
      const result = file(pathData);
      return result.includes('[name]')
        ? result.replace(/\.([a-z]+)$/i, '.worker.$1')
        : result.replace(/\.([a-z]+)$/i, '.[name].worker.$1');
    };
  } else {
    return file.includes('[name]')
      ? file.replace(/\.([a-z]+)$/i, '.worker.$1')
      : file.replace(/\.([a-z]+)$/i, '.[name].worker.$1');
  }
}

const loader = {
  pitch,
};

export default loader;
