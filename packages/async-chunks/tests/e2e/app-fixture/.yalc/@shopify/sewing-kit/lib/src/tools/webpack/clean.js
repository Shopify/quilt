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
const fs_extra_1 = require("fs-extra");
const TASK = Symbol('CleanWebpack');
function cleanWebpack(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const buildDirectory = path_1.relative(workspace.paths.root, workspace.paths.build);
        if (workspace.project.isNode) {
            const assetDirectories = ['client', 'server'];
            yield Promise.all(assetDirectories.map(directory => fs_extra_1.remove(path_1.join(buildDirectory, directory))));
        } else {
            yield fs_extra_1.remove(buildDirectory);
        }
    });
}
exports.default = cleanWebpack;