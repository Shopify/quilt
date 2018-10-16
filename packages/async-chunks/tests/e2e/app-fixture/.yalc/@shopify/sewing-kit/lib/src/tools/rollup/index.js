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
const rollup_1 = require("rollup");
const config_1 = require("./config");
const TASK = Symbol('Rollup');
function runRollup(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK, workspace)) {
            return;
        }
        runner.perform(TASK, workspace);
        const inputOptions = config_1.createInputConfig(workspace);
        const bundle = yield rollup_1.rollup(inputOptions);
        const outputOptions = config_1.createOutputConfig(workspace);
        yield bundle.write(outputOptions);
        // eslint-disable-next-line consistent-return
        return new Promise(resolve => {
            resolve();
        });
    });
}
exports.default = runRollup;