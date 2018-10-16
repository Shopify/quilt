"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function getChunkAssets(buildPath, assetBasePath, files) {
    const paths = (Array.isArray(files) ? files : [files]).map(file => path_1.relative(assetBasePath, path_1.join(buildPath, file)));
    return paths.reduce((asset, path) => {
        const extension = path_1.extname(path).replace('.', '');
        asset[extension] = path;
        return asset;
    }, {});
}
function getAssetManifest(assetBasePath, compilation) {
    const chunks = compilation.chunks;
    const buildPath = compilation.outputOptions.path;
    return chunks.reduce((assets, { name, files }) => {
        assets[name] = getChunkAssets(buildPath, assetBasePath, files);
        return assets;
    }, {});
}
exports.getAssetManifest = getAssetManifest;