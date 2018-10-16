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
const hang_tight_manifest_1 = require("./hang-tight-manifest");
const config_1 = require("../config");
function manifest(workspace, _) {
    return __awaiter(this, void 0, void 0, function* () {
        const { env: { isDevelopment }, project: { isRails } } = workspace;
        try {
            const path = config_1.getManifestPath(workspace);
            const manifest = yield fs_extra_1.readJSON(path);
            if (isDevelopment && isRails) {
                manifest.path = path;
            }
            return manifest;
        } catch (err) {
            if (isDevelopment && isRails) {
                return hang_tight_manifest_1.default;
            }
            throw err;
        }
    });
}
exports.default = manifest;