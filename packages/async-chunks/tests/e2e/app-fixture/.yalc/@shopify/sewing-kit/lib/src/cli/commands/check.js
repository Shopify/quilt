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
const typescript_1 = require("../../tools/typescript");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const common_1 = require("./common");
exports.command = 'check';
exports.desc = 'runs all lint checks and tests';
exports.builder = Object.assign({}, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ mode: 'test' }), runner, argv);
        const { default: runJest } = yield Promise.resolve().then(() => require('../../tools/jest'));
        const { default: runESLint, runGraphQLLint } = yield Promise.resolve().then(() => require('../../tools/eslint'));
        const { default: runGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../../tools/graphql-typescript-definitions'));
        const { default: runValidateGraphQLFixtures } = yield Promise.resolve().then(() => require('../../tools/validate-graphql-fixtures'));
        const { default: runStylelint } = yield Promise.resolve().then(() => require('../../tools/stylelint'));
        const { default: runTypeScript } = yield Promise.resolve().then(() => require('../../tools/typescript'));
        const { runPrettierLint } = yield Promise.resolve().then(() => require('../../tools/prettier'));
        yield typescript_1.verifyTypescript(workspace, runner);
        yield runGraphQLLint(workspace, runner);
        yield runValidateGraphQLFixtures(workspace, runner, {
            showPasses: argv.logLevel === runner_1.Verbosity.debug
        });
        yield runGraphQLTypeScriptDefinitions(workspace, { watch: false }, runner);
        yield runStylelint(workspace, runner);
        yield runESLint(workspace, runner);
        yield runTypeScript(workspace, runner);
        yield runPrettierLint(workspace, runner, {
            graphql: true,
            json: true,
            markdown: true
        });
        yield runJest(workspace, { watch: false }, runner);
    });
}
exports.handler = handler;