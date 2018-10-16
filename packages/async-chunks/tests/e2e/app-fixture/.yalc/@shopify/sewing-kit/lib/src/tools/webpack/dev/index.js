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
const env_1 = require("../../../env");
const workspace_1 = require("../../../workspace");
const graphql_1 = require("../../graphql");
const graphql_typescript_definitions_1 = require("../../graphql-typescript-definitions");
const config_1 = require("../config");
const clean_1 = require("../clean");
const warmup_1 = require("./warmup");
const dashboard_1 = require("./middleware/dashboard");
const client_1 = require("./client");
const server_1 = require("./server");
const vendor_dll_1 = require("./vendor-dll");
const typescript_1 = require("../../typescript");
const WARMUP_COOLDOWN_DELAY = 3000;
const TASK = Symbol('Dev');
function runDev(workspace, { hot = true, sourceMaps = 'fast', lazy = false, debug = false, logReactUpdates = false, focus = [] }, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const warmup = new warmup_1.default(workspace, runner);
        warmup.start();
        // eslint-disable-next-line prefer-const
        let client;
        let server;
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([safeDisposeBundle(client), safeDisposeBundle(server), warmup.end(), dashboard.end()]);
                process.exit(0);
            } catch (error) {
                process.exit(1);
            }
        }));
        const finalOptions = {
            focus,
            sourceMaps,
            vscodeDebug: debug
        };
        warmup.sendStatus({ message: '‍🏃🏼‍♀️  Getting started...' });
        yield clean_1.default(workspace, runner);
        yield graphql_1.default(workspace, runner);
        yield graphql_typescript_definitions_1.default(workspace, { watch: true }, runner);
        const useVendorDLL = vendor_dll_1.hasVendorDLL(workspace);
        if (useVendorDLL) {
            if (yield vendor_dll_1.isVendorDLLUpToDate(workspace, runner)) {
                runner.logger.info(chalk => `${chalk.bold('[vendor dll]')} ♻️  Reusing (start from scratch with 'yarn sewing-kit clean --vendor-dll')`);
            } else {
                try {
                    runner.logger.info(chalk => `${chalk.bold('[vendor dll]')} ⚙️  Building`);
                    warmup.sendStatus({ message: '⚙️  Building vendors' });
                    yield vendor_dll_1.default(workspace, runner);
                } catch (err) {
                    const message = '🙀  Vendor build failed.  Try stopping your server, then `dev up`';
                    runner.logger.error(err);
                    runner.logger.info(message);
                    warmup.sendStatus({ message, errors: [err.toString()] });
                    return;
                }
            }
        }
        const clientConfig = yield config_1.default(workspace, finalOptions);
        const dashboard = new dashboard_1.default(workspace, runner);
        client = new client_1.default(clientConfig, workspace, dashboard, runner, {
            hot,
            lazy,
            logReactUpdates
        });
        warmup.listenToClient(client);
        dashboard.listenToClient(client);
        yield client.run();
        if (workspace.project.isNode || workspace.config.for('experiments').railsWithNodeServer) {
            const serverWorkspace = yield workspace_1.default(new env_1.default({ mode: 'development', target: 'server' }), runner);
            const serverConfig = yield config_1.default(serverWorkspace, finalOptions);
            server = new server_1.default(serverConfig, client, warmup, runner, { debug });
            warmup.listenToServer(server);
            yield server.run();
        } else {
            setTimeout(() => {
                warmup.end();
            }, WARMUP_COOLDOWN_DELAY);
        }
        typescript_1.default(workspace, runner, { watch: true });
    });
}
exports.default = runDev;
function safeDisposeBundle(bundle) {
    return bundle == null ? Promise.resolve() : bundle.dispose();
}