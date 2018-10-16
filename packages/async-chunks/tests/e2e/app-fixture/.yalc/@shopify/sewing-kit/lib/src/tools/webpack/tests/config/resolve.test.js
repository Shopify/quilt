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
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const config_1 = require("../../config");
describe('webpackConfig()', () => {
    describe('resolveLoader', () => {
        describe('modules', () => {
            it('includes own and project node_modules', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                expect((yield config_1.default(workspace))).toHaveProperty('resolveLoader.modules', [workspace.paths.sewingKitNodeModules, workspace.paths.nodeModules]);
            }));
        });
    });
    describe('resolve', () => {
        describe('modules', () => {
            it('includes node_modules, app root, and packages', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                expect((yield config_1.default(workspace))).toHaveProperty('resolve.modules', [workspace.paths.packages, 'node_modules', workspace.paths.app]);
            }));
            it('does not include packages when they don’t exist', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    paths: { packages: undefined }
                });
                expect((yield config_1.default(workspace))).toHaveProperty('resolve.modules', ['node_modules', workspace.paths.app]);
            }));
        });
        describe('extensions', () => {
            it('includes .js, .jsx, .ts, .tsx and .json extensions', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace();
                expect((yield config_1.default(workspace))).toHaveProperty('resolve.extensions', ['.js', '.jsx', '.json', '.ts', '.tsx']);
            }));
        });
        describe('mainFields', () => {
            it('includes `jsnext:main`, `module`, and `main` when resolving the main fields for server environments', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server' })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('resolve.mainFields', ['jsnext:main', 'module', 'main']);
            }));
            it('includes the browser field for client environments', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client' })
                });
                expect((yield config_1.default(workspace))).toHaveProperty('resolve.mainFields', ['browser', 'jsnext:main', 'module', 'main']);
            }));
        });
        describe('alias', () => {
            describe('@shopify/polaris', () => {
                it('omits Polaris aliases when @shopify/polaris is not a dependency', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace();
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.@shopify/polaris');
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.@shopify/polaris/styles');
                }));
                it.each([['development', 'test']])('omits Polaris aliases for @shopify/polaris in %s', mode => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        dependencies: utilities_1.createDependency('@shopify/polaris'),
                        env: new env_1.default({ mode })
                    });
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.@shopify/polaris');
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.@shopify/polaris/styles');
                }));
                it.each([['production', 'staging']])('includes a @shopify/polaris alias to the esnext folder in %s', mode => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        dependencies: utilities_1.createDependency('@shopify/polaris'),
                        env: new env_1.default({ mode })
                    });
                    const { resolve } = yield config_1.default(workspace);
                    expect(resolve.alias).toMatchObject({
                        '@shopify/polaris$': expect.stringContaining('node_modules/@shopify/polaris/esnext'),
                        '@shopify/polaris/styles.scss': expect.stringContaining('@shopify/polaris/esnext/styles.scss'),
                        '@shopify/polaris/styles': expect.stringContaining('node_modules/@shopify/polaris/esnext/styles')
                    });
                }));
            });
            describe('react', () => {
                it('does not alias react by default', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace();
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.react');
                    expect((yield config_1.default(workspace))).not.toHaveProperty('resolve.alias.react-dom');
                }));
                it('includes an alias for react and react-dom if using preact-compat', () => __awaiter(_this, void 0, void 0, function* () {
                    const workspace = utilities_1.createWorkspace({
                        dependencies: utilities_1.createDependency('preact-compat')
                    });
                    const { resolve } = yield config_1.default(workspace);
                    expect(resolve.alias.react).toEqual('preact-compat');
                    expect(resolve.alias['react-dom']).toEqual('preact-compat');
                }));
            });
        });
    });
});