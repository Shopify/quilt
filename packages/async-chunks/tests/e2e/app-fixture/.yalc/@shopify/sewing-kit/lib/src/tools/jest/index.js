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
const path_1 = require("path");
const config_1 = require("./config");
exports.createConfig = config_1.default;
const jest_1 = require("./jest");
const TASK = Symbol('Jest');
function runJest(workspace, _a, runner) {
    var { watch = !workspace.env.isCI, cacheDirectory = path_1.join(workspace.paths.cache, 'jest'), debug = false, updateSnapshot = false, testRegex, coverage = false, maxWorkers = undefined } = _a,
        options = __rest(_a, ["watch", "cacheDirectory", "debug", "updateSnapshot", "testRegex", "coverage", "maxWorkers"]);
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (usesGraphQL) {
            // We need to run this ahead of time as our GraphQL test utilities rely on
            // getting the schema, and some application code can depend on the generated
            // schema types
            const { default: buildGraphQL } = yield Promise.resolve().then(() => require('../graphql'));
            const { default: runGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../graphql-typescript-definitions'));
            yield buildGraphQL(workspace, runner);
            yield runGraphQLTypeScriptDefinitions(workspace, { watch: false }, runner);
        }
        // Do this as the first thing so that any code reading it knows the right env.
        process.env.BABEL_ENV = 'test';
        process.env.NODE_ENV = 'test';
        const config = yield config_1.default(workspace, options);
        const args = new Set(['--config', JSON.stringify(config), `--cacheDirectory=${cacheDirectory}`]);
        const semver = yield Promise.resolve().then(() => require('semver'));
        if (semver.gte(require('jest/package.json').version, '22.0.0')) {
            args.add('--passWithNoTests');
        }
        if (updateSnapshot) {
            args.add('--updateSnapshot');
        }
        if (debug) {
            args.add('--runInBand');
            args.add('--forceExit');
        } else if (maxWorkers) {
            args.add(`--maxWorkers=${maxWorkers}`);
        } else if (workspace.env.isCI) {
            args.add(`--maxWorkers=3`);
        }
        if (workspace.env.isCI) {
            args.add('--forceExit');
        } else {
            if (testRegex == null) {
                args.add('--onlyChanged');
            }
            if (watch) {
                args.add(testRegex == null ? '--watch' : '--watchAll');
            }
        }
        if (testRegex) {
            args.add('--testPathPattern');
            args.add(testRegex);
        }
        if (coverage) {
            args.add('--coverage');
        }
        yield jest_1.default.run([...args]);
    });
}
exports.default = runJest;