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
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const manifest_1 = require("./manifest");
const entrypoints_1 = require("./entrypoints");
class AssetMetadataPlugin {
    constructor(options = {}) {
        this.options = Object.assign({ assetBasePath: false, filename: 'assets.json' }, options);
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('AssetMetadataPlugin', (compilation, callback) => __awaiter(this, void 0, void 0, function* () {
            const assetBasePath = this.options.assetBasePath || compilation.outputOptions.path;
            const output = {
                assets: manifest_1.getAssetManifest(assetBasePath, compilation),
                entrypoints: {}
            };
            compilation.entrypoints.forEach((_, entryName) => {
                output.entrypoints[entryName] = entrypoints_1.getChunkDependencies(compilation, entryName);
            });
            try {
                yield fs_extra_1.mkdirp(compilation.outputOptions.path);
                yield fs_extra_1.writeFile(path_1.join(compilation.outputOptions.path || '', this.options.filename), JSON.stringify(output, null, 2));
            } catch (err) {
                compilation.errors.push(err);
            } finally {
                callback();
            }
        }));
    }
}
exports.AssetMetadataPlugin = AssetMetadataPlugin;