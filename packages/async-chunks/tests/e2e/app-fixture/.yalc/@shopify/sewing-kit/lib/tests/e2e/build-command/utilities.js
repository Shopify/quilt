"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const express = require("express");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
function runBuild(fixtureDir, options = {}) {
    const optionsStr = Object.keys(options).reduce((accumulator, key) => {
        // eslint-disable-next-line no-param-reassign
        accumulator += `${key} ${options[key]} `;
        return accumulator;
    }, '');
    child_process_1.execSync(`${utilities_1.sewingKitCLI} build ${optionsStr}`, {
        cwd: fixtureDir,
        stdio: 'inherit'
    });
}
exports.runBuild = runBuild;
function runClientBuild(fixtureDir, options = {}) {
    return runBuild(fixtureDir, Object.assign({}, options, { '--client-only': 'true' }));
}
exports.runClientBuild = runClientBuild;
function runServerBuild(fixtureDir, options = {}) {
    return runBuild(fixtureDir, Object.assign({}, options, { '--server-only': 'true' }));
}
exports.runServerBuild = runServerBuild;
function runFixtureServer(fixtureBuildPath, port) {
    const js = getClientAssets(fixtureBuildPath).map(path => `<script src="${path_1.basename(path)}"></script>`).join('\n');
    const app = express();
    const listener = app.listen(port);
    app.get('/', (_, response) => {
        response.send(js);
    });
    app.get('/*.js', (request, response) => {
        response.send(fs_extra_1.readFileSync(path_1.join(fixtureBuildPath, request.path), 'utf-8'));
    });
    return listener;
}
exports.runFixtureServer = runFixtureServer;
function getClientAssets(fixtureBuildPath) {
    return fs_extra_1.readJSONSync(path_1.join(fixtureBuildPath, 'assets.json')).entrypoints.main.js.map(asset => asset.path);
}
function yarnInstall(fixtureDir) {
    child_process_1.execSync('yarn install --mutex file:/tmp/.yarn-mutex', {
        cwd: fixtureDir,
        stdio: 'inherit'
    });
}
exports.yarnInstall = yarnInstall;