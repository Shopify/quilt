"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
exports.prettierIgnorePaths = ['.*', 'build', 'playground', 'coverage', 'tmp', 'public', 'package.json', '*.svg'];
function init(workspace, runner) {
    const { paths } = workspace;
    if (prettierIgnoreExists(paths)) {
        runner.logger.info('.prettierignore already exists.');
    } else {
        fs_extra_1.writeFileSync(path_1.join(paths.root, '.prettierignore'), exports.prettierIgnorePaths.join('\n'));
        runner.logger.info('.prettierignore created.');
    }
}
exports.init = init;
function prettierIgnoreExists(paths) {
    const { root } = paths;
    return fs_extra_1.existsSync(path_1.join(root, '.prettierignore'));
}