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
const fs_1 = require("fs");
const path = require("path");
const webpack = require("webpack");
function removeHashes(paths) {
    return paths.map(({ path }) => path.replace(/-[0-9a-f]+\./, '.'));
}
exports.removeHashes = removeHashes;
function runWebpack(fixture) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalDir = process.cwd();
        process.chdir(fixture);
        const config = require(path.join(fixture, 'webpack.config'));
        const compiler = webpack(config);
        try {
            yield new Promise((resolve, reject) => {
                compiler.run((err, stats) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const info = stats.toJson();
                    if (stats.hasErrors()) {
                        reject(new Error(info.errors));
                        return;
                    }
                    if (stats.hasWarnings()) {
                        reject(new Error(info.warnings));
                        return;
                    }
                    resolve();
                });
            });
        } finally {
            process.chdir(originalDir);
        }
    });
}
exports.runWebpack = runWebpack;
function opensslHash(path) {
    if (!fs_1.existsSync(path)) {
        throw new Error(`opensslHash - ${path} does not exist`);
    }
    // openssl command reference - https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
    return child_process_1.execSync(`cat ${path} | openssl dgst -sha256 -binary | openssl enc -base64 -A`).toString();
}
exports.opensslHash = opensslHash;