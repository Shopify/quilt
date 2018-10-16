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
exports.command = 'dev';
exports.desc = 'starts a hot-reloading development server';
exports.builder = Object.assign({ hot: {
        boolean: true,
        default: true
    }, 'source-maps': {
        choices: ['accurate', 'fast', 'off'],
        default: 'fast'
    }, lazy: {
        boolean: true,
        default: false
    }, debug: {
        boolean: true,
        default: false
    }, focus: {
        array: true,
        default: []
    }, 'log-react-updates': {
        boolean: true,
        default: false
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ mode: 'development', target: 'client' }), runner, argv);
        const { verifyTypescript } = yield Promise.resolve().then(() => require('../../tools/typescript'));
        const { default: validateDevConfig } = yield Promise.resolve().then(() => require('../../tools/validate-dev-config'));
        yield Promise.all([verifyTypescript(workspace, runner), validateDevConfig(workspace, runner)]);
        const { runDev } = yield Promise.resolve().then(() => require('../../tools/webpack'));
        return runDev(workspace, argv, runner);
    });
}
exports.handler = handler;