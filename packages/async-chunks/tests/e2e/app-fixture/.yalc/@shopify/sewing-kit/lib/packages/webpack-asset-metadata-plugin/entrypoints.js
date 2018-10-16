"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const integrity_sha_utils_1 = require("../../../lib/packages/integrity-sha-utils");
function getChunkDependencies({ entrypoints, outputOptions }, entryName) {
    const { publicPath = '', hashFunction, hashDigest } = outputOptions;
    const dependencyChunks = entrypoints.get(entryName).chunks;
    const allChunkFiles = dependencyChunks.reduce((allFiles, depChunk) => [...allFiles, ...depChunk.files], []);
    const dependencies = { css: [], js: [] };
    allChunkFiles.forEach(path => {
        const extension = path_1.extname(path).replace('.', '');
        if (!dependencies[extension]) {
            dependencies[extension] = [];
        }
        const integrity = integrity_sha_utils_1.calculateBase64IntegrityFromFilename(path, hashFunction, hashDigest);
        dependencies[extension].push(Object.assign({ path: `${publicPath}${path}` }, integrity ? { integrity } : {}));
    });
    return dependencies;
}
exports.getChunkDependencies = getChunkDependencies;