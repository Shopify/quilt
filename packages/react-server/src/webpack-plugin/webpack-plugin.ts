import {join} from 'path';

import {Compiler} from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import {HEADER, Options, Entrypoint, noSourceExists} from './shared';
import {errorSSRComponentExists, errorClientSource} from './error';

/**
 * A webpack plugin that generates default server and client entrypoints if none are present.
 * @param config
 * @returns a customized webpack plugin
 */
export class ReactServerPlugin {
  private options: Options;

  constructor({
    host,
    port,
    assetPrefix,
    basePath = '.',
    proxy = false,
  }: Partial<Options> = {}) {
    this.options = {
      basePath,
      host,
      port,
      assetPrefix,
      proxy,
    };
  }

  apply(compiler: Compiler) {
    const modules = this.modules(compiler);
    const virtualModules = new VirtualModulesPlugin(modules);
    (virtualModules as any).apply(compiler);
  }

  private modules(compiler: Compiler) {
    const {basePath} = this.options;
    const modules: Record<string, string> = {};

    if (noSourceExists(Entrypoint.Client, this.options, compiler)) {
      const file = join(basePath, `${Entrypoint.Client}.js`);
      modules[file] = clientSource();
    }

    if (noSourceExists(Entrypoint.Server, this.options, compiler)) {
      const file = join(basePath, `${Entrypoint.Server}.js`);
      modules[file] = serverSource(this.options, compiler);
    }

    if (errorSSRComponentExists(this.options, compiler)) {
      const file = join(basePath, `${Entrypoint.Error}.entry.client.js`);
      modules[file] = errorClientSource();
    }

    return modules;
  }
}

function serverSource(options: Options, compiler: Compiler) {
  const {port, host, assetPrefix, proxy} = options;

  return `
    ${HEADER}
    import React from 'react';
    import {createServer} from '@shopify/react-server';

    import App from 'index';

    ${
      errorSSRComponentExists(options, compiler)
        ? "import Error from 'error';"
        : ''
    }

    process.on('uncaughtException', logError);
    process.on('unhandledRejection', logError);
    function logError(error) {
      const errorLog = \`\${error.stack || error.message || 'No stack trace was present'}\`;
      console.log(\`React Server failed to start.\n\${errorLog}\`);
      process.exit(1);
    }

    const render = (ctx) => {
      return React.createElement(App, {
        url: ctx.request.URL,
        data: ctx.state.quiltData,
      });
    }

    const app = createServer({
      port: ${port},
      ip: ${JSON.stringify(host)},
      assetPrefix: ${JSON.stringify(assetPrefix)},
      proxy: ${proxy},
      render,
      ${
        errorSSRComponentExists(options, compiler)
          ? `renderError: (ctx) => {
              return React.createElement(Error, {
                url: ctx.request.url,
                data: ctx.state.quiltData,
                error: ctx.state.quiltError,
              });
            }`
          : ''
      }
    });

    export default app;
  `;
}

function clientSource() {
  return `
    ${HEADER}
    import React from 'react';
    import ReactDOM from 'react-dom';
    import {showPage, getSerialized} from '@shopify/react-html';

    import App from 'index';

    const appContainer = document.getElementById('app');
    const data = getSerialized('quilt-data');
    const url = new URL(window.location.href);

    ReactDOM.hydrate(React.createElement(App, {data, url}), appContainer);
    showPage();
  `;
}
