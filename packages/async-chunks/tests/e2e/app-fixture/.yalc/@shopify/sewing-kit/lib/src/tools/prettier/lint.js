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
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const util_1 = require("util");
const utilities_1 = require("./utilities");
const utilities_2 = require("../../utilities");
const TASK = Symbol('PrettierLint');
function runPrettierLint(workspace, runner, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const executable = utilities_1.prettierExecutable(workspace);
        const globs = utilities_1.getFileTypeGlobs(options);
        if (!globs) {
            return;
        }
        try {
            yield util_1.promisify(child_process_1.exec)(`${JSON.stringify(executable)} '${globs}' --list-different`);
        } catch (error) {
            if (typeof error.stdout !== 'string') {
                throw error;
            }
            if (options.showExpected) {
                displayExpected(executable, error.stdout.trim().split('\n'), runner);
            } else {
                const output = [error.stdout, error.stderr].join('\n').trim();
                runner.logger.info(`\n${output}\n`);
            }
            runner.logger.info(nextStepGuidance(options));
            runner.fail();
        }
    });
}
exports.runPrettierLint = runPrettierLint;
function displayExpected(executable, pathsWithErrors, { logger }) {
    pathsWithErrors.forEach(path => {
        if (fs_extra_1.existsSync(path)) {
            const expected = child_process_1.execSync(`${JSON.stringify(executable)} '${path}'`).toString();
            logger.info(`${path} expected:\n${expected}`);
        } else {
            logger.info(path);
        }
    });
}
function nextStepGuidance(options) {
    return function (chalk) {
        // prettier-ignore
        return utilities_2.flatten([`Unformatted files found. Next steps include:`, `- ${chalk.bold('yarn run sewing-kit format')} - to potentially autofix unformatted code`, options.showExpected ? null : `- ${chalk.bold('yarn run sewing-kit lint --show-expected')} - to view expected file contents`, `- ${chalk.bold('yarn run sewing-kit init --prettierignore')} - to inititalize a .prettierignore file, then paste the above files into it`, `  - See ${chalk.underline('https://prettier.io/docs/en/ignore.html')} for more information\n`]).join('\n');
    };
}