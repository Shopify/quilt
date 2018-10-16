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
exports.command = 'format';
exports.desc = 'formats files using Prettier';
exports.builder = Object.assign({ graphql: {
        boolean: true,
        default: undefined
    }, json: {
        boolean: true,
        default: undefined
    }, markdown: {
        boolean: true,
        default: undefined
    }, scripts: {
        boolean: true,
        default: undefined
    }, styles: {
        boolean: true,
        default: undefined
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ mode: 'development' }), runner, argv);
        const { graphql = true, json = true, markdown = true, scripts = true, styles = true } = argv;
        if (styles) {
            const { default: runStylelint } = yield Promise.resolve().then(() => require('../../tools/stylelint'));
            yield runStylelint(workspace, runner, { runFixer: true });
        }
        if (scripts) {
            const { default: runESLint } = yield Promise.resolve().then(() => require('../../tools/eslint'));
            yield runESLint(workspace, runner, { runFixer: true });
        }
        const { runPrettierFormat } = yield Promise.resolve().then(() => require('../../tools/prettier'));
        yield runPrettierFormat(workspace, runner, {
            json,
            graphql,
            markdown
        });
        runner.logger.info('Formatting completed.');
    });
}
exports.handler = handler;