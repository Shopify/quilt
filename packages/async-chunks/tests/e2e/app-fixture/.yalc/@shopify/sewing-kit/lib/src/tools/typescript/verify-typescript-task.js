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
const chalk_1 = require("chalk");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const TASK = Symbol('VerifyTypeScript');
const ADD_TS = chalk_1.default.bold('yarn add typescript');
exports.TS_INDEX_WITHOUT_TS = `sewing-kit cannot build a typescript project without typescript as a project dependency. Run ${ADD_TS} in your project directory and try again.`;
function verifyTypescript(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const { paths: { app, root }, project: { usesTypeScript } } = workspace;
        if (runner.hasPerformed(TASK)) {
            return;
        }
        if (usesTypeScript && (yield missingTSConfig(root))) {
            runner.logger.error(noTSConfig(root));
            runner.fail();
        }
        if (!usesTypeScript && (yield hasTypescriptEntry(app, root))) {
            // eslint-disable-next-line no-console
            runner.logger.error(new Error(exports.TS_INDEX_WITHOUT_TS));
            runner.fail();
        }
    });
}
exports.default = verifyTypescript;
function hasTypescriptEntry(app, root) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield Promise.all([fs_extra_1.pathExists(path_1.join(app, 'index.ts')), fs_extra_1.pathExists(path_1.join(app, 'index.tsx')), fs_extra_1.pathExists(path_1.join(root, 'client', 'index.ts')), fs_extra_1.pathExists(path_1.join(root, 'client', 'index.tsx'))]);
            return results.some(pathDoesExist => pathDoesExist === true);
        } catch (error) {
            return false;
        }
    });
}
function missingTSConfig(root) {
    return __awaiter(this, void 0, void 0, function* () {
        return !(yield fs_extra_1.pathExists(path_1.join(root, 'tsconfig.json')));
    });
}
function noTSConfig(root) {
    const rootPath = chalk_1.default.bold(root);
    return new Error(`sewing-kit cannot build a typescript project without tsconfig.json in the ${rootPath}. Create a new tsconfig.json in ${rootPath} or remove typescript from your package.json.`);
}
exports.noTSConfig = noTSConfig;