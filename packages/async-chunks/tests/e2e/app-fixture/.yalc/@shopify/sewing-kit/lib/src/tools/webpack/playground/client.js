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
const events_1 = require("events");
const webpack = require("webpack");
const URL = require("url");
const express = require("express");
const createWebpackMiddleware = require("webpack-dev-middleware");
const path_1 = require("path");
const config_1 = require("../config");
const utilities_1 = require("../utilities");
const createWebpackHotMiddleware = require('webpack-hot-middleware');
const getPort = require('get-port');
class Client extends events_1.EventEmitter {
    constructor(entryPoint, workspace) {
        super();
        this.entryPoint = entryPoint;
        this.workspace = workspace;
    }
    on(event, handler) {
        return super.on(event, handler);
    }
    emit(event, ...payload) {
        return super.emit(event, ...payload);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield createPlaygroundConfig(this.entryPoint, this.workspace);
            const compiler = webpack(config);
            compiler.hooks.compile.tap('Playground', () => {
                this.emit('compile');
            });
            compiler.hooks.done.tap('Playground', stats => {
                this.emit('done', stats);
            });
            const app = express();
            const host = 'localhost';
            const port = yield getPort({ port: 8080, host });
            const hmrPath = utilities_1.getHMRPath(config.output.publicPath);
            const webpackDevMiddleware = createWebpackMiddleware(compiler, {
                lazy: false,
                logLevel: 'silent',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                publicPath: config.output.publicPath,
                watchOptions: {
                    ignored: /node_modules/
                }
            });
            app.get('/', express.static(path_1.dirname(this.entryPoint)));
            app.use(webpackDevMiddleware);
            app.use(createWebpackHotMiddleware(compiler, {
                log: false,
                path: URL.resolve(hmrPath, '__webpack_hmr')
            }));
            config.plugins.push(new webpack.HotModuleReplacementPlugin());
            app.listen(port, host);
            // eslint-disable-next-line no-return-await
            return yield new Promise(resolve => {
                this.once('done', () => {
                    resolve({ host, port });
                });
            });
        });
    }
}
exports.default = Client;
function createPlaygroundConfig(entry, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield config_1.default(workspace, {
            sourceMaps: 'fast',
            report: false,
            vscodeDebug: false
        });
        // We don't need the public path or the entry point, since these
        // are going to be different than what we want for the actual bundles.
        // Instead, we just use the config generator to get the rest of the
        // Webpack config, and overwrite as necessary below.
        config.output.publicPath = '/assets/';
        config.entry = entry;
        if (workspace.project.usesPolaris) {
            config.entry = utilities_1.prependToEntries(config.entry, '@shopify/polaris/styles/components.scss');
            config.entry = utilities_1.prependToEntries(config.entry, '@shopify/polaris/styles/global.scss');
        }
        utilities_1.addHMRConfig(workspace, config);
        return config;
    });
}