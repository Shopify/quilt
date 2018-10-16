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
const env_1 = require("../../env");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const common_1 = require("./common");
exports.command = 'test [test-regex]';
exports.desc = 'runs all tests';
exports.builder = Object.assign({ watch: {
        boolean: true,
        default: undefined
    }, 'cache-directory': {
        string: true,
        default: undefined,
        hidden: true
    }, debug: {
        boolean: true,
        default: false
    }, 'max-workers': {
        number: true,
        default: undefined,
        hidden: true
    }, 'update-snapshot': {
        boolean: true,
        default: false,
        alias: 'u'
    }, coverage: {
        boolean: true,
        default: false
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ target: 'client', mode: 'test' }), runner, argv);
        const { isCI } = workspace.env;
        const { watch = !isCI, cacheDirectory, debug, maxWorkers, testRegex, updateSnapshot, coverage } = argv;
        const options = {
            watch,
            cacheDirectory,
            debug,
            maxWorkers,
            testRegex,
            updateSnapshot,
            coverage
        };
        const { default: runJest } = yield Promise.resolve().then(() => require('../../tools/jest'));
        return runJest(workspace, options, runner);
    });
}
exports.handler = handler;