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
const crypto = require("crypto");
const fs_extra_1 = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
var clean_1 = require("./clean");
exports.clean = clean_1.cleanVendorDLL;
const excludedModules = [
// Has no entry point.
'@shopify/javascript-utilities',
// Requires node packages.
'@shopify/sewing-kit-server',
// Must be part of the app bundle for hot reloading to work.
'react-hot-loader'];
function getVendorModules(workspace) {
    const vendorsPlugin = workspace.config.for('vendors');
    const vendors = vendorsPlugin == null ? [] : vendorsPlugin.modules;
    return vendors.filter(vendor => !excludedModules.includes(vendor));
}
exports.getVendorModules = getVendorModules;
function hasVendorDLL(workspace) {
    return workspace.env.isDevelopmentClient && getVendorModules(workspace).length > 0;
}
exports.hasVendorDLL = hasVendorDLL;
function vendorDLLManifestPath(workspace) {
    return path.join(workspace.paths.cache, 'dll', 'vendor.json');
}
exports.vendorDLLManifestPath = vendorDLLManifestPath;
function buildVendorDLL(workspace, runner) {
    if (!hasVendorDLL(workspace)) {
        return Promise.resolve();
    }
    const compiler = webpack({
        mode: 'development',
        devtool: 'inline-source-map',
        entry: {
            vendor: getVendorModules(workspace)
        },
        output: {
            path: path.join(workspace.paths.cache, 'dll'),
            filename: 'vendor.js',
            library: 'vendor'
        },
        plugins: [new webpack.DllPlugin({
            path: vendorDLLManifestPath(workspace),
            name: 'vendor'
        })],
        resolve: {
            mainFields: ['browser', 'main']
        }
    });
    return new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                reject(error);
                return;
            } else if (stats.hasErrors()) {
                reject(new Error(stats.toString('errors-only')));
                return;
            }
            writeHash(workspace, runner);
            resolve();
        });
    });
}
exports.default = buildVendorDLL;
function isVendorDLLUpToDate(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([fs_extra_1.pathExists(vendorDLLManifestPath(workspace)), getPreviousHash(workspace), calculateHash(workspace)]).then(([dllExists, previousHash, currentHash]) => {
            if (!dllExists) {
                runner.logger.debug(`Vendor DLL does not exist`);
                return false;
            }
            if (!previousHash) {
                runner.logger.debug(`Previous vendor DLL hash not found`);
                return false;
            }
            runner.logger.debug(`Vendor DLL hash comparison: ${previousHash} vs ${currentHash}`);
            return previousHash === currentHash;
        });
    });
}
exports.isVendorDLLUpToDate = isVendorDLLUpToDate;
function pathToVendorDLLHash(workspace) {
    return path.join(workspace.paths.cache, 'vendor-hash.txt');
}
function calculateHash(workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([yield fs_extra_1.readFile('./yarn.lock', 'utf-8'), yield fs_extra_1.readFile('./node_modules/.yarn-integrity', 'utf-8')]).then(([lockFile, integrityFile]) => {
            const hash = crypto.createHash('md5');
            hash.setEncoding('hex');
            hash.write(lockFile);
            hash.write(integrityFile);
            hash.write(JSON.stringify(getVendorModules(workspace)));
            hash.end();
            return `${workspace.env.mode}-${hash.read()}`;
        }).catch(() => {
            return false;
        });
    });
}
function writeHash(workspace, { logger }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs_extra_1.writeFile(pathToVendorDLLHash(workspace), (yield calculateHash(workspace)));
        } catch (err) {
            logger.debug(`Vendor DLL hash could not be written ${err}`);
        }
    });
}
function getPreviousHash(workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fs_extra_1.readFile(pathToVendorDLLHash(workspace), 'utf-8');
        } catch (err) {
            return false;
        }
    });
}