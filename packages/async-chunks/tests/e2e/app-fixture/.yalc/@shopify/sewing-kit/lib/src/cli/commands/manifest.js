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
const common_1 = require("./common");
exports.command = 'manifest';
exports.desc = 'internal use only';
exports.builder = Object.assign({ target: {
        choices: ['client', 'server'],
        default: 'client'
    }, mode: {
        choices: ['development', 'production', 'staging', 'test'],
        default: 'production'
    } }, common_1.options);
function handler(_a) {
    var { target, mode } = _a,
        options = __rest(_a, ["target", "mode"]);
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(options.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ target, mode }), runner, options);
        const { default: manifest } = yield Promise.resolve().then(() => require('../../tools/webpack/manifest'));
        // The purpose of this command is to print out the JSON version of the manifest
        // eslint-disable-next-line no-console
        console.log(JSON.stringify((yield manifest(workspace, runner))));
    });
}
exports.handler = handler;