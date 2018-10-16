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
const glob_1 = require("glob");
const fs_extra_1 = require("fs-extra");
const optimize_1 = require("@shopify/images/optimize");
const utilities_1 = require("../utilities");
const SVGO = require('svgo');
const TASK = Symbol('SVGO');
const svgo = new SVGO(optimize_1.svgOptions());
function runSVGO(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const files = glob_1.sync(path_1.join(utilities_1.projectSourceDirectoryGlobPattern(workspace), '**/*.svg'));
        yield Promise.all(files.map(optimizeFile));
    });
}
exports.default = runSVGO;
function optimizeFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_extra_1.readFile(file, 'utf8');
        const result = yield svgo.optimize(data);
        if (result.data === data) {
            return;
        }
        yield fs_extra_1.remove(file);
        yield fs_extra_1.writeFile(file, result.data);
    });
}