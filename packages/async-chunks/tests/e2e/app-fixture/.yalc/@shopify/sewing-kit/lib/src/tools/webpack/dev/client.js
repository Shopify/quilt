"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const URL = require("url");
const webpack = require("webpack");
const createWebpackMiddleware = require("webpack-dev-middleware");
const events_1 = require("events");
const server_sent_event_stream_manager_1 = require("./server-sent-event-stream-manager");
const utilities_1 = require("../utilities");
const listener_manager_1 = require("./listener-manager");
const file_not_found_1 = require("./middleware/file-not-found");
const vendor_dll_1 = require("./vendor-dll");
const createWebpackHotMiddleware = require('webpack-hot-middleware');
const DEFAULT_DEV_ASSET_HOST = '192.168.64.254';
class Client extends events_1.EventEmitter {
    constructor(config, workspace, dashboard, runner, options = {}) {
        super();
        this.config = config;
        this.workspace = workspace;
        this.dashboard = dashboard;
        this.runner = runner;
        this.options = options;
        this.webpackDevMiddleware = null;
        this.listenerManager = null;
    }
    on(event, handler) {
        return super.on(event, handler);
    }
    emit(event, ...payload) {
        return super.emit(event, ...payload);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { config, workspace, options: { hot, lazy, logReactUpdates }, runner } = this;
            const { project } = workspace;
            const { logger } = runner;
            const { dashboard } = this;
            const useVendorDLL = vendor_dll_1.hasVendorDLL(workspace);
            if (hot) {
                utilities_1.addHMRConfig(workspace, config);
            }
            if (useVendorDLL) {
                addVendorDLLConfig(workspace, config);
            }
            if (logReactUpdates) {
                addWhyDidYouUpdateConfig(workspace, config, runner);
            }
            const compiler = webpack(config);
            const app = express();
            app.use('*', (_, response, next) => {
                response.setHeader('Access-Control-Allow-Origin', '*');
                return next();
            });
            const { devPort } = project;
            const host = devPort ? DEFAULT_DEV_ASSET_HOST : 'localhost';
            const port = devPort || 8080;
            const { output } = compiler.options;
            const publicPath = output && output.publicPath || '/';
            const devMiddlewareOptions = {
                lazy,
                logLevel: 'silent',
                publicPath,
                watchOptions: {
                    ignored: /node_modules/
                }
            };
            app.use(['^/$', '^/assets/?$', '/webpack/assets/?$'], dashboard.middleware(publicPath));
            app.use(['/sk-dashboard-events$', '*/sk-dashboard-events$'], (request, response) => {
                // eslint-disable-next-line typescript/no-non-null-assertion
                dashboard.streamManager.sendHeaders(request, response);
            });
            const hmrPath = utilities_1.getHMRPath(devMiddlewareOptions.publicPath);
            const webpackDevMiddleware = createWebpackMiddleware(compiler, devMiddlewareOptions);
            const fileNotFound = new file_not_found_1.default(publicPath);
            this.webpackDevMiddleware = webpackDevMiddleware;
            app.use(webpackDevMiddleware);
            if (hot) {
                app.use(createWebpackHotMiddleware(compiler, {
                    log: false,
                    path: URL.resolve(hmrPath, '__webpack_hmr')
                }));
            }
            if (useVendorDLL) {
                app.use('/webpack/assets/dll/', express.static(path.join(workspace.paths.cache, 'dll')));
            } else {
                app.use('/webpack/assets/dll/', (_, response) => {
                    response.send('"This is an empty script to prevent 404s for vendor bundle requests.  ' + 'Add a plugins.vendors configuration to your sewing-kit.config ' + '(see https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/vendors.md for more information)";');
                });
            }
            app.use('*/hang-tight-redirect.js', (_, response) => {
                const { ip: host = 'localhost', port = 8081 } = this.workspace.config.for('devServer') || {};
                response.setHeader('Content-type', 'application/javascript');
                response.send(`location.assign('http://${host}:${port}')`);
            });
            app.use(fileNotFound.middleware);
            compiler.hooks.done.tap('SewingKit.Dev.FileNotFound', stats => {
                fileNotFound.update(stats);
            });
            compiler.hooks.compile.tap('SewingKit.Dev.Client', () => {
                logger.info(chalk => `${chalk.bold('[client]')} Compiling`);
                this.emit('compile');
            });
            compiler.hooks.failed.tap('SewingKit.Dev.Client', error => {
                this.emit('compile-failed', error);
            });
            compiler.hooks.done.tap('SewingKit.Dev.Client', stats => {
                utilities_1.logStats(runner, stats, { name: 'client' });
                if (stats.hasErrors() || stats.hasWarnings()) {
                    this.emit('compile-error', stats);
                } else {
                    this.emit('done', stats);
                }
            });
            const listener = app.listen(port, host);
            this.listenerManager = new listener_manager_1.default(listener, { name: 'client' });
            dashboard.streamManager = new server_sent_event_stream_manager_1.default(listener, { name: 'dashboard' });
            const hosts = [`http://${host}:${port}/webpack/assets/`];
            if (project.usesDev) {
                hosts.push(...project.devProxyHosts.map(host => `https://${host.host}/webpack/assets/`));
            }
            logger.info(chalk => {
                const hostLinks = hosts.map(host => chalk.underline(host));
                return `${chalk.bold('[asset server]')} Serving assets from:\n    • ${hostLinks.join('\n    • ')}\n\n    (cmd+click a link for more information)\n`;
            });
            yield new Promise(resolve => {
                this.once('done', () => {
                    resolve();
                });
            });
        });
    }
    dispose() {
        if (this.webpackDevMiddleware) {
            this.webpackDevMiddleware.close();
        }
        return this.listenerManager ? this.listenerManager.dispose(this.runner) : Promise.resolve();
    }
}
exports.default = Client;
function addVendorDLLConfig(workspace, config) {
    const manifest = require(vendor_dll_1.vendorDLLManifestPath(workspace));
    config.plugins.push(new webpack.DllReferencePlugin({
        context: workspace.paths.root,
        manifest
    }));
}
function addWhyDidYouUpdateConfig(workspace, config, runner) {
    if (!workspace.project.usesReact) {
        runner.logger.warn('React updates can only be shown for projects using react.');
        runner.fail();
        return;
    }
    if (!workspace.project.hasDevDependency('why-did-you-update')) {
        runner.logger.warn(chalk => `Run ${chalk.bold('yarn add --dev why-did-you-update')} to activate React logging.`);
        runner.fail();
        return;
    }
    const initializerPath = require.resolve('./why-did-you-update-initializer');
    config.entry = utilities_1.prependToEntries(config.entry, initializerPath);
}