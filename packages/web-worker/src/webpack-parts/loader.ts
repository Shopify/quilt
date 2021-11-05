import * as path from 'path';

import {getOptions} from 'loader-utils';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import FetchCompileWasmTemplatePlugin from 'webpack/lib/web/FetchCompileWasmTemplatePlugin';

import {WebWorkerPlugin} from './plugin';

const NAME = 'WebWorker';

const moduleWrapperCache = new Map<string, string | false>();

export interface Options {
  name?: string;
  wrapperModule?: string;
}

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

  if (compiler.options.output!.globalObject !== 'self') {
    callback!(
      new Error(
        'webpackConfig.output.globalObject is not set to "self", which will cause chunk loading in the worker to fail. Please change the value to "self" for any builds targeting the browser, or set the {noop: true} option on the @remote-ui/web-workers babel plugin.',
      ),
    );
    return;
  }

  const plugin: WebWorkerPlugin = (compiler.options.plugins || []).find(
    WebWorkerPlugin.isInstance,
  ) as any;

  if (plugin == null) {
    throw new Error(
      'You must also include the WebWorkerPlugin from `@remote-ui/web-workers` when using the Babel plugin.',
    );
  }

  const options: Options = getOptions(this) || {};
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
      addWorkerSubExtension(compiler.options.output!.filename as string),
    chunkFilename: addWorkerSubExtension(
      compiler.options.output!.chunkFilename!,
    ),
    globalObject: (plugin && plugin.options.globalObject) || 'self',
  };

  const workerCompiler: import('webpack').Compiler = compilation.createChildCompiler(
    NAME,
    workerOptions,
    [],
  );

  (workerCompiler as any).context = (compiler as any).context;

  new WebWorkerTemplatePlugin({}).apply(workerCompiler);
  new FetchCompileWasmTemplatePlugin({
    mangleImports: (compiler.options.optimization! as any).mangleWasmImports,
  }).apply(workerCompiler);
  new SingleEntryPlugin(
    context,
    wrapperContent == null ? request : virtualModule,
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
  return file.includes('[name]')
    ? file.replace(/\.([a-z]+)$/i, '.worker.$1')
    : file.replace(/\.([a-z]+)$/i, '.[name].worker.$1');
}

const loader = {
  pitch,
};

export default loader;
