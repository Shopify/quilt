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
const child_process_1 = require("child_process");
const config_1 = require("../config");
const utilities_1 = require("../utilities");
const IGNORE_WARNINGS = [
// These two warnings are deprecations in React that affect dependencies,
// so there is nothing we can do about it.
/Accessing PropTypes via the main React package is deprecated/i, /React\.createClass is deprecated and will be removed in version 16/i,
// This is a deprecation in a Koa dependency, we are keeping an eye on it
// and will update when it's resolved.
/koa deprecated Support for generators will be removed in v3/i];
class Server extends events_1.EventEmitter {
    constructor(config, client, warmup, runner, options = {}) {
        super();
        this.config = config;
        this.client = client;
        this.warmup = warmup;
        this.runner = runner;
        this.options = options;
        this.clientIsCompiling = false;
        this.startServerIsQueued = false;
        this.isDisposing = false;
        this.hasStarted = false;
        this.lastClientStats = null;
        this.watcher = null;
        this.server = null;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.startServer = this.startServer.bind(this);
            const { client, config, runner } = this;
            const compiler = webpack(config);
            const { logger } = runner;
            client.on('compile', () => {
                this.clientIsCompiling = true;
                delete this.lastClientStats;
            });
            client.on('done', stats => {
                this.lastClientStats = stats;
                if (stats.hasErrors() || stats.hasWarnings()) {
                    return;
                }
                this.clientIsCompiling = false;
                if (this.startServerIsQueued) {
                    this.startServer();
                }
            });
            compiler.hooks.compile.tap('SewingKit.Dev.Server', () => {
                logger.info(chalk => `${chalk.bold('[server]')} Compiling`);
                this.emit('compile');
            });
            compiler.hooks.failed.tap('SewingKit.Dev.Server', error => {
                this.emit('compile-failed', error);
            });
            compiler.hooks.done.tap('SewingKit.Dev.Server', stats => {
                logger.debug(stats.toString());
                if (this.isDisposing) {
                    return;
                }
                if (stats.hasErrors() || stats.hasWarnings()) {
                    utilities_1.logStats(runner, stats, {
                        name: 'server',
                        onlyErrors: true,
                        matchingStats: this.lastClientStats
                    });
                    this.emit('compile-error', stats, this.lastClientStats);
                    return;
                }
                this.emit('done', stats);
                logger.info(chalk => `${chalk.bold(`[server]`)} Compiled with latest changes (${utilities_1.compileTime(stats)})`);
                if (this.clientIsCompiling) {
                    this.startServerIsQueued = true;
                } else {
                    this.startServer();
                }
            });
            this.watcher = compiler.watch({}, noop);
            return new Promise(resolve => {
                this.once('done', () => {
                    resolve();
                });
            });
        });
    }
    on(event, handler) {
        return super.on(event, handler);
    }
    emit(event, ...payload) {
        return super.emit(event, ...payload);
    }
    dispose() {
        this.isDisposing = true;
        this.killServer();
        return new Promise(resolve => {
            if (this.watcher) {
                this.watcher.close(resolve);
            } else {
                resolve();
            }
        });
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const { logger } = this.runner;
            this.startServerIsQueued = false;
            yield this.warmup.end();
            if (this.server) {
                this.killServer();
                logger.info('Restarting server...');
            }
            try {
                const args = this.options.debug ? ['--inspect=5858', config_1.getServerBundle(this.config)] : [config_1.getServerBundle(this.config)];
                const newServer = child_process_1.spawn('node', args);
                logger.info(chalk => `${chalk.bold('[server]')} Running with latest changes`);
                newServer.stdout.on('data', data => {
                    // eslint-disable-next-line no-warning-comments
                    // TODO: message
                    logger.warn(data.toString().trim());
                });
                newServer.stderr.on('data', data => {
                    const message = data.toString().trim();
                    // node outputs the Debugger messages to stderr. This is not an error...
                    if (data.includes('Debugger')) {
                        logger.info(message);
                        return;
                    }
                    if (IGNORE_WARNINGS.some(warning => warning.test(message))) {
                        return;
                    }
                    logger.warn(chalk => `${chalk.bold('[server]')} Error in server execution, check the console for more info.`);
                    // eslint-disable-next-line no-console
                    console.error(data.toString().trim());
                });
                if (!this.hasStarted) {
                    this.hasStarted = true;
                }
                this.server = newServer;
            } catch (error) {
                logger.warn(chalk => `${chalk.bold('[server]')} Failed to start, please check the console for more information.`);
                logger.error(error);
            }
        });
    }
    killServer() {
        if (this.server == null) {
            return;
        }
        this.server.kill();
        delete this.server;
    }
}
exports.default = Server;
function noop() {}