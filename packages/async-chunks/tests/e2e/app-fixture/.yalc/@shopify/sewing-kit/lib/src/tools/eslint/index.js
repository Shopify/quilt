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
const utilities_1 = require("./utilities");
var graphql_1 = require("./graphql");
exports.runGraphQLLint = graphql_1.default;
const TASK = Symbol('ESLint');
function runESLint(workspace, runner, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const ignorePatterns = (workspace.project.isRails ? ['public', 'tmp', 'vendor/bundle'] : []).map(pattern => `--ignore-pattern ${pattern}`).join(' ');
        const { runFixer } = options;
        const fixer = runFixer ? '--fix' : '';
        const extensions = (workspace.project.usesTypeScript ? ['.ts', '.tsx'] : []).concat('.js', '.jsx');
        yield utilities_1.execESLint(workspace, runner, `${ignorePatterns} ${fixer}`, extensions, {
            env: Object.assign({}, process.env, { FORCE_COLOR: true })
        });
    });
}
exports.default = runESLint;