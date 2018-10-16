"use strict";

var _this = this;

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
const path = require("path");
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const plugins = require("../../../../plugins");
const config_1 = require("../../config");
const server = new env_1.default({ target: 'server' });
const client = new env_1.default({ target: 'client' });
const development = new env_1.default({ mode: 'development' });
describe('webpackConfig()', () => {
    describe('output', () => {
        describe('path', () => {
            it('generates files in the build directory for development Rails', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    isRails: true,
                    env: new env_1.default({ mode: 'development' })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.path', workspace.paths.build);
            }));
            it.each([['production'], ['staging'], ['test']])('generates files in the public bundles directory for %s Rails', mode => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    isRails: true,
                    env: new env_1.default({ mode })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.path', path.join(workspace.paths.root, 'public/bundles'));
            }));
            it('puts the files a directory matching the target for Node apps', () => __awaiter(_this, void 0, void 0, function* () {
                const clientWorkspace = utilities_1.createWorkspace({ isRails: false, env: client });
                expect((yield config_1.default(clientWorkspace))).toHaveProperty('output.path', path.join(clientWorkspace.paths.build, 'client'));
                const serverWorkspace = utilities_1.createWorkspace({ isRails: false, env: server });
                expect((yield config_1.default(serverWorkspace))).toHaveProperty('output.path', path.join(clientWorkspace.paths.build, 'server'));
            }));
        });
        describe('filename', () => {
            it.each([['production'], ['staging']])('embeds chunkhashes for %s clients', mode => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.filename', '[name]-[chunkhash].js');
            }));
            // A webpack@4 workaround forced `main.js` to be hardcoded as the server bundle name.
            // eslint-disable-next-line no-warning-comments
            // TODO: remove this test once https://github.com/Shopify/sewing-kit/issues/626 is fixed
            it('uses main as a single server bundle', () => __awaiter(_this, void 0, void 0, function* () {
                const serverWorkspace = utilities_1.createWorkspace({ env: server });
                expect((yield config_1.default(serverWorkspace))).toHaveProperty('output.filename', 'main.js');
            }));
            it('uses just the name for all other outputs', () => __awaiter(_this, void 0, void 0, function* () {
                const devWorkspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' })
                });
                expect((yield config_1.default(devWorkspace))).toHaveProperty('output.filename', '[name].js');
                const testWorkspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'test' })
                });
                expect((yield config_1.default(testWorkspace))).toHaveProperty('output.filename', '[name].js');
            }));
        });
        describe('chunkFilename', () => {
            it('uses the name and chunkhash', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                expect((yield config_1.default(workspace))).toHaveProperty('output.chunkFilename', '[name]-[chunkhash].js');
            }));
        });
        describe('crossOriginLoading', () => {
            it('is omitted by default', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace({ env: development }));
                expect(config).not.toHaveProperty('crossOriginLoading');
            }));
            it('avoids oblique React errors by forcing anonymous crossOrigin chunk requests', () => __awaiter(_this, void 0, void 0, function* () {
                // See https://reactjs.org/docs/cross-origin-errors.html#webpack
                const { output } = yield config_1.default(utilities_1.createWorkspace({
                    env: development,
                    dependencies: utilities_1.createDependency('react')
                }), { sourceMaps: 'fast' });
                expect(output).toHaveProperty('crossOriginLoading', 'anonymous');
            }));
        });
        // eslint-disable-next-line no-warning-comments
        // TODO: check if we can make this simplification
        describe('publicPath', () => {
            it('uses CDN', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    plugins: [plugins.cdn('https://my.cdn.com')]
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.publicPath', 'https://my.cdn.com');
            }));
            it('defaults to /assets/ for node projects', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                expect((yield config_1.default(workspace))).toHaveProperty('output.publicPath', '/assets/');
            }));
            it('defaults to Railgun/webpack proxy path for node/dev project development', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    devYaml: {},
                    railgunYaml: {}
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.publicPath', '/webpack/assets/');
            }));
            it('defaults to Railgun/webpack proxy path for Rails development', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ isRails: true, env: development });
                expect((yield config_1.default(workspace))).toHaveProperty('output.publicPath', '/webpack/assets/');
            }));
            it.each([['production'], ['staging'], ['test']])('defaults to shopify-cloud asset path for %s Rails', mode => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    isRails: true,
                    env: new env_1.default({ mode })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('output.publicPath', '/bundles/');
            }));
        });
        describe('libraryTarget', () => {
            it('uses the commonJS target for the server', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: server });
                expect((yield config_1.default(workspace))).toHaveProperty('output.libraryTarget', 'commonjs2');
            }));
            it('uses the var target for the client', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: client });
                expect((yield config_1.default(workspace))).toHaveProperty('output.libraryTarget', 'var');
            }));
        });
        describe('hash', () => {
            it('uses a sha256 output hash function with an output hash digest length of 64', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace());
                expect(config).toHaveProperty('output.hashFunction', 'sha256');
                expect(config).toHaveProperty('output.hashDigestLength', 64);
            }));
        });
        describe('devtool', () => {
            it('does not set any custom devtool formatting by default', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace());
                expect(config).not.toHaveProperty('output.devtoolModuleFilenameTemplate');
                expect(config).not.toHaveProperty('output.devtoolFallbackModuleFilenameTemplate');
            }));
            it('sets the devtool formatting for VSCode', () => __awaiter(_this, void 0, void 0, function* () {
                const config = yield config_1.default(utilities_1.createWorkspace(), {
                    vscodeDebug: true
                });
                expect(config).toHaveProperty('output.devtoolModuleFilenameTemplate', '[absolute-resource-path]');
                expect(config).toHaveProperty('output.devtoolFallbackModuleFilenameTemplate', '[absolute-resource-path]?[hash]');
            }));
        });
    });
});