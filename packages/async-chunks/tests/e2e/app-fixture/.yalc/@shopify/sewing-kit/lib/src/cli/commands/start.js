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
const child_process_1 = require("child_process");
const env_1 = require("../../env");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const common_1 = require("./common");
exports.command = 'start';
exports.desc = '(Node only) - starts a local server in production mode';
const RAILGUN_ASSETS_IP = '192.168.64.254';
exports.builder = Object.assign({ 'client-heap-size': {
        number: true,
        hidden: true
    }, clean: {
        boolean: true,
        default: true,
        hidden: true
    }, graphql: {
        boolean: true,
        default: true
    }, 'source-maps': {
        choices: ['accurate', 'fast', 'off'],
        default: 'fast'
    }, 'optimize-assets': {
        boolean: true,
        default: true
    }, 'server-heap-size': {
        number: true,
        hidden: true
    }, uglify: {
        choices: ['beautify', 'off', 'on'],
        default: 'on'
    }, 'asset-server-only': {
        boolean: true,
        default: false
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ target: 'client', mode: 'production' }), runner, argv);
        yield startAssetsServer(workspace, runner);
        if (argv.assetServerOnly) {
            return;
        }
        if (workspace.project.isRails) {
            yield clientBuild(workspace, argv, runner);
        } else {
            const serverWorkspace = yield workspace_1.default(new env_1.default({ target: 'server', mode: 'production' }), runner, argv);
            const { runParallelWebpack } = yield Promise.resolve().then(() => require('../../tools/webpack'));
            yield runParallelWebpack(argv, runner, workspace, serverWorkspace);
            yield startNodeServer(serverWorkspace);
        }
    });
}
exports.handler = handler;
function clientBuild(workspace, argv, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const { default: runWebpack } = yield Promise.resolve().then(() => require('../../tools/webpack'));
        yield runWebpack(workspace, {
            graphql: argv.graphql,
            optimizeAssets: argv.optimizeAssets,
            uglify: argv.uglify,
            sourceMaps: argv.sourceMaps
        }, runner);
    });
}
function startAssetsServer({ project, paths }, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetsPort = project.devPort || 8080;
        const assetsHost = project.usesDev ? RAILGUN_ASSETS_IP : 'localhost';
        const assetsDir = path.resolve(paths.build, 'client');
        const express = yield Promise.resolve().then(() => require('express'));
        const app = express();
        app.use((_, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        app.use('/webpack/assets/', express.static(assetsDir));
        const server = app.listen(assetsPort, assetsHost, () => runner.logger.info(chalk => `${chalk.white('[assets]')} Server listening on ${assetsHost}:${assetsPort}`));
        process.on('SIGTERM', () => server.close());
        process.on('SIGINT', () => server.close());
    });
}
function startNodeServer(serverWorkspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const { createConfig, getServerBundle } = yield Promise.resolve().then(() => require('../../tools/webpack'));
        const serverBundle = getServerBundle((yield createConfig(serverWorkspace)));
        child_process_1.spawn('node', [serverBundle], { stdio: 'inherit' });
    });
}