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
const strings_1 = require("./strings");
const TASK = Symbol('ValidateDevConfig');
function validateDevConfig({ project }, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        const { isRails, usesDev, devType, hasProcfile } = project;
        if (isRails && usesDev) {
            if (devType === 'ruby') {
                runner.logger.error(new Error(strings_1.VANILLA_RUBY));
                runner.fail();
            }
            if (hasProcfile) {
                return;
            }
            if (hasPortMismatch(project)) {
                runner.logger.error(new Error(strings_1.PORT_MISMATCH));
                runner.fail();
            }
        }
    });
}
exports.default = validateDevConfig;
function hasPortMismatch(project) {
    const { devYamlPort, devPort } = project;
    if (devYamlPort === undefined || devPort === undefined) {
        return true;
    }
    return devYamlPort !== devPort;
}