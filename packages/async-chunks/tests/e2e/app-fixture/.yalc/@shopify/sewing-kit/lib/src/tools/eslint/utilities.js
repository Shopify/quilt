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
const path_1 = require("path");
const util_1 = require("util");
function execESLint({ paths }, runner, args, extensions = [], execOptions = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const executable = path_1.join(paths.sewingKitNodeModules, '.bin/eslint');
        const cachePath = path_1.join(paths.cache, 'eslint-scripts');
        const extensionsArgs = extensions.map(ext => `--ext ${ext}`).join(' ');
        try {
            const command = `${JSON.stringify(executable)} . ${extensionsArgs} --max-warnings 0 --format codeframe --cache --cache-location ${JSON.stringify(`${cachePath}${path_1.sep}`)} ${args}`;
            runner.logger.debug(`Executing ESLint command: ${command}`);
            const { stderr, stdout } = yield util_1.promisify(child_process_1.exec)(command, Object.assign({ cwd: paths.root }, execOptions));
            handleOutput(runner, extensions, stderr || '', stdout || '');
        } catch (error) {
            const { stderr, stdout } = extractErrorOutput(error);
            handleOutput(runner, extensions, stderr, stdout);
        }
    });
}
exports.execESLint = execESLint;
function extractErrorOutput(error) {
    return {
        stderr: (error.stderr || '').toString(),
        stdout: (error.stdout || '').toString()
    };
}
// ESLint will emit output on either stderr or stdout, so we need to process
// both streams to cover all possible output.
function handleOutput(runner, extensions, stderr, stdout) {
    // if we have stderr content, we need to pre-process before we look at the
    // stdout content
    if (stderr) {
        // check if ESLint is just complaining that we linted a project with no
        // matching files.
        if (/No files matching the pattern .* were found/.test(stderr)) {
            runner.logger.debug(`No {${extensions ? extensions.join(',') : 'source'}} files found`);
            // return early, we don't want any more output in this scenario
            return;
        }
        // if there was no stdout content then process the stderr content instead
        if (!stdout) {
            runner.logger.info(sanitizeESLintOutput(stderr));
            runner.fail();
            // return early since we have processed the stderr as the only output
            return;
        }
        // if the debug logger is active, then emit the stderr to the debug log
        // (in addition to emitting stdout)
        runner.logger.debug(stderr);
    }
    // we haven't emitted any stderr content so now we process stdout content
    if (stdout) {
        runner.logger.info(sanitizeESLintOutput(stdout));
        runner.fail();
    }
}
function sanitizeESLintOutput(output) {
    return function (chalk) {
        return output.replace(/potentially fixable with.+\./, `potentially fixable with ${chalk.bold.white('yarn run sewing-kit format')}`);
    };
}