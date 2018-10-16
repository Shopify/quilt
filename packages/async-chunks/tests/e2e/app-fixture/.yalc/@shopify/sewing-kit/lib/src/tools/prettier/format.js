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
const util_1 = require("util");
const utilities_1 = require("./utilities");
const TASK = Symbol('PrettierFormat');
function runPrettierFormat(workspace, runner, options) {
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
        yield util_1.promisify(child_process_1.exec)(`${JSON.stringify(executable)} '${globs}' --write`);
    });
}
exports.runPrettierFormat = runPrettierFormat;