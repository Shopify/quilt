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
const path_1 = require("path");
const child_process_1 = require("child_process");
const util_1 = require("util");
const TASK = Symbol('Stylelint');
function runStylelint(workspace, runner, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const executable = path_1.join(workspace.paths.sewingKitNodeModules, '.bin/stylelint');
        const ignorePatterns = ['node_modules', 'vendor/bundle'].reduce((buffer, pattern) => `${buffer} --ignore-pattern ${pattern}`, '');
        const fixer = options.runFixer ? '--fix' : '';
        try {
            const result = yield util_1.promisify(child_process_1.exec)(`${JSON.stringify(executable)} ${ignorePatterns} ${fixer} './**/*.scss'`, { env: Object.assign({}, process.env, { FORCE_COLOR: true }) });
            runner.logger.info(`${result.stdout}`);
        } catch (error) {
            if (typeof error.stdout !== 'string') {
                throw error;
            }
            // If the error is with a style rule, we want the full output.
            // Otherwise we can pull off the first line and discard
            // the stack trace for when log-level is 'debug'.
            const errorToLog = error.code === 2 ? error.stdout : error.stdout.split('\n')[0];
            runner.logger.info(errorToLog);
            runner.logger.debug(error);
            if (error.code === 78 && error.stdout.includes('No configuration provided')) {
                runner.logger.info(['To resolve this error you must provide a stylelint configuration.', 'If you wish to use Shopify’s stylelint configuration, add the', 'following to your project’s package.json:', stylelintExample()].join(' '));
            }
            runner.fail();
        }
    });
}
exports.default = runStylelint;
function stylelintExample() {
    let output = '\n\n';
    JSON.stringify({
        stylelint: {
            extends: ['stylelint-config-shopify']
        }
    }, null, 2).split('\n').forEach(line => {
        output += `  ${line}\n`;
    });
    return output;
}