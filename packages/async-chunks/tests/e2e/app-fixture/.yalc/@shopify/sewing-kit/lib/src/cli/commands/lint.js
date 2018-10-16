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
exports.command = 'lint';
exports.desc = 'lints Sass, JSON, JavaScript, TypeScript, and GraphQL files';
exports.builder = Object.assign({ 'graphql-fixtures': {
        boolean: true,
        default: undefined
    }, graphql: {
        boolean: true,
        default: undefined
    }, json: {
        boolean: true,
        default: undefined
    }, markdown: {
        boolean: true,
        default: undefined
    }, styles: {
        boolean: true,
        default: undefined
    }, scripts: {
        boolean: true,
        default: undefined
    }, 'show-expected': {
        boolean: true,
        default: false
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default({ mode: 'test' }), runner, argv);
        const { default: runESLint, runGraphQLLint } = yield Promise.resolve().then(() => require('../../tools/eslint'));
        const { runPrettierLint } = yield Promise.resolve().then(() => require('../../tools/prettier'));
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        const { graphql = true, graphqlFixtures = usesGraphQL, json = true, markdown = true, styles = true, scripts = true, showExpected = false, logLevel } = argv;
        if (graphql) {
            yield runGraphQLLint(workspace, runner);
        }
        if (graphql && graphqlFixtures) {
            const { default: runValidateGraphQLFixtures } = yield Promise.resolve().then(() => require('../../tools/validate-graphql-fixtures'));
            yield runValidateGraphQLFixtures(workspace, runner, {
                showPasses: logLevel === runner_1.Verbosity.debug
            });
        }
        if (styles) {
            const { default: runStylelint } = yield Promise.resolve().then(() => require('../../tools/stylelint'));
            yield runStylelint(workspace, runner);
        }
        if (scripts) {
            if (graphql) {
                const { default: runGraphQLTypeScriptDefinitions } = yield Promise.resolve().then(() => require('../../tools/graphql-typescript-definitions'));
                yield runGraphQLTypeScriptDefinitions(workspace, { watch: false }, runner);
            }
            yield runESLint(workspace, runner);
        }
        yield runPrettierLint(workspace, runner, {
            json,
            markdown,
            showExpected,
            graphql
        });
        process.exit(0);
    });
}
exports.handler = handler;