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
const __1 = require("../..");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const common_1 = require("./common");
exports.command = 'build-parallel';
// This command is hidden because it's not officially supported; just a temporary
// workaround until better performance improvements are found.
exports.desc = false;
exports.builder = Object.assign({ clean: {
        boolean: true,
        default: true,
        hidden: true
    }, 'client-heap-size': {
        number: true,
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
    }, focus: {
        array: true,
        default: []
    } }, common_1.options);
function handler(_a) {
    var options = __rest(_a, []);
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(options.logLevel));
        const { runParallelWebpack } = yield Promise.resolve().then(() => require('../../tools/webpack'));
        yield runParallelWebpack(options, runner, (yield workspace_1.default(new __1.Env({ target: 'client', mode: 'production' }), runner, options)), (yield workspace_1.default(new __1.Env({ target: 'server', mode: 'production' }), runner, options)));
    });
}
exports.handler = handler;