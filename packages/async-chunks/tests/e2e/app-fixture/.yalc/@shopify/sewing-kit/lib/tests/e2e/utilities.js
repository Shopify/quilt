"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
exports.sewingKitCLI = path_1.resolve(__dirname, '..', '..', 'bin', 'sewing-kit');
function hashFile(...pathSegments) {
    const hash = crypto.createHash('sha256');
    hash.setEncoding('hex');
    hash.write(fs_extra_1.readFileSync(path_1.resolve(...pathSegments)));
    hash.end();
    return hash.read();
}
exports.hashFile = hashFile;