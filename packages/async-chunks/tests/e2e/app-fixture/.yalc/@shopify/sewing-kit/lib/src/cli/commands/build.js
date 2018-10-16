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
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../env");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const typescript_1 = require("../../tools/typescript");
const utilities_1 = require("../../utilities");
const common_1 = require("./common");
exports.command = 'build';
exports.desc = 'compiles code and SCSS into deployable assets';
exports.builder = Object.assign({ clean: {
        boolean: true,
        default: true,
        hidden: true
    }, 'client-only': {
        boolean: true,
        default: false
    }, graphql: {
        boolean: true,
        default: true
    }, mode: {
        choices: ['development', 'production', 'staging', 'test'],
        default: 'production'
    }, report: {
        boolean: true,
        default: false
    }, 'server-only': {
        boolean: true,
        default: false
    }, 'source-maps': {
        choices: ['accurate', 'fast', 'off'],
        default: 'fast'
    }, 'optimize-assets': {
        boolean: true,
        default: true
    },
    // Always ship with uglify on; off/beautify are for troubleshooting/analysis only.
    uglify: {
        choices: ['beautify', 'off', 'on'],
        default: 'on',
        hidden: true
    }, focus: {
        array: true,
        default: []
    } }, common_1.options);
function handler(_a) {
    var { mode } = _a,
        options = __rest(_a, ["mode"]);
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        const runner = new runner_1.default(new runner_1.Logger(options.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ target: 'client', mode }), runner, options);
        yield typescript_1.verifyTypescript(workspace, runner);
        if (workspace.config.library) {
            const { default: runRollup } = yield Promise.resolve().then(() => require('../../tools/rollup'));
            yield runRollup(workspace, runner);
            return;
        }
        const { default: runWebpack } = yield Promise.resolve().then(() => require('../../tools/webpack'));
        if (!options.serverOnly) {
            const reportPromise = reportWaiter(options);
            yield runWebpack(workspace, options, runner);
            const reportGenerationStart = Date.now();
            yield reportPromise;
            if (options.report) {
                const reportTime = utilities_1.msToMinutesAndSeconds(Date.now() - reportGenerationStart);
                runner.logger.info(`Report generated (${reportTime})`);
            }
        }
        // eslint-disable-next-line no-warning-comments
        // TODO: check if server exists, instead of just switching on Node
        if ((workspace.project.isNode || workspace.config.for('experiments').railsWithNodeServer) && !options.clientOnly) {
            const serverWorkspace = yield workspace_1.default(new env_1.default({ target: 'server', mode }), runner, options);
            yield runWebpack(serverWorkspace, options, runner);
            const buildTime = utilities_1.msToMinutesAndSeconds(Date.now() - startTime);
            if (!options.serverOnly) {
                runner.logger.info(`Build complete (${buildTime})`);
            }
        }
    });
}
exports.handler = handler;
function reportWaiter({ report }) {
    //
    /*
     * Required because `webpack-plugin-bundle-analyzer` has this behaviour:
     *
     * 1. It registers a `done` callback on the client compilation object
     * 2. The `done` callback queues up an async task to write out a stats file
     * 3. Writing stats is intentionally executed outside webpack's lifecycle
     *   - ("Making analyzer logs to be after all webpack logs in the console")
     * 3. For `shopify/web`, writing out stats takes 12-20 seconds
     * 4. I'm unsure of what's happening at this point, but kicking off server
     *    compilation while stats are still writing causes a memory exhaustion
     *    error after 200+ seconds
     *   - My best guess is that the retained client stats object prevents
     *     garbage collection of webpack caches, and server compilation demands
     *     enough memory to cause page swap thrashing until everything crashes
     *
     * There's no easy way to hook into this ad hoc lifecycle, and so this just
     * listens for `console.log` messages sent when the plugin is definitely
     * done with client stats.
     */
    /* eslint-disable no-console */
    const reportPromise = report ? new Promise(resolve => {
        const oldLog = console.log;
        console.log = function (...args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('saved report')) {
                console.log = oldLog;
                resolve();
            }
            return oldLog.apply(console, args);
        };
    }) : Promise.resolve();
    /* eslint-enable no-console */
    return reportPromise;
}