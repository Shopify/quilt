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
describe('webpackConfig()', () => {
    describe('entry', () => {
        it('uses the app path as the default entry point for Rails apps', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({ isRails: true });
            const { entry } = yield config_1.default(workspace);
            expect(entry[entry.length - 1]).toBe(workspace.paths.app);
        }));
        it('uses the client path as the default path for client node apps', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({
                isRails: false,
                env: client
            });
            const { entry } = yield config_1.default(workspace);
            expect(entry[entry.length - 1]).toBe(path.join(workspace.paths.root, 'client'));
        }));
        it('uses the server path as the default path for server node apps', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({
                isRails: false,
                env: server
            });
            const { entry } = yield config_1.default(workspace);
            expect(entry[entry.length - 1]).toBe(path.join(workspace.paths.root, 'server'));
        }));
        it('uses a passed string entry from plugins', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({
                plugins: [plugins.entry('my-file.js')]
            });
            const { entry } = yield config_1.default(workspace);
            expect(entry[entry.length - 1]).toBe('my-file.js');
        }));
        it('uses a passed string array entry from plugins', () => __awaiter(_this, void 0, void 0, function* () {
            const files = ['file-one.ts', 'file-two.ts'];
            const workspace = utilities_1.createWorkspace({
                plugins: [plugins.entry(files)]
            });
            const { entry } = yield config_1.default(workspace);
            expect(entry[entry.length - 2]).toBe(files[0]);
            expect(entry[entry.length - 1]).toBe(files[1]);
        }));
        it('uses a passed object array entry from plugins', () => __awaiter(_this, void 0, void 0, function* () {
            const files = {
                one: ['file-one.ts'],
                two: ['file-two.ts', 'file-two-two.ts']
            };
            const workspace = utilities_1.createWorkspace({
                plugins: [plugins.entry(files)]
            });
            const { entry } = yield config_1.default(workspace);
            expect(entry.one[entry.one.length - 1]).toBe(files.one[0]);
            expect(entry.two[entry.two.length - 2]).toBe(files.two[0]);
            expect(entry.two[entry.two.length - 1]).toBe(files.two[1]);
        }));
        it('includes source-map-support for servers', () => __awaiter(_this, void 0, void 0, function* () {
            const serverWorkspace = utilities_1.createWorkspace({ env: server });
            const serverConfig = yield config_1.default(serverWorkspace);
            expect(serverConfig.entry.includes('source-map-support/register')).toBe(true);
            const clientConfig = yield config_1.default(utilities_1.createWorkspace({ env: client }));
            expect(clientConfig.entry.includes('source-map-support/register')).toBe(false);
        }));
        it('includes regenerator-runtime for clients', () => __awaiter(_this, void 0, void 0, function* () {
            const clientWorkspace = utilities_1.createWorkspace({ env: client });
            const clientConfig = yield config_1.default(clientWorkspace);
            expect(clientConfig.entry.includes('regenerator-runtime/runtime')).toBe(true);
            const serverWorkspace = utilities_1.createWorkspace({ env: server });
            const serverConfig = yield config_1.default(serverWorkspace);
            expect(serverConfig.entry.includes('regenerator-runtime/runtime')).toBe(false);
        }));
        describe('Polaris Sass', () => {
            it('omits Polaris files when @shopify/polaris is not a dependency', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({ env: client });
                const { entry } = yield config_1.default(workspace);
                if (Array.isArray(entry)) {
                    entry.forEach(file => {
                        expect(file).not.toMatch(/@shopify\/polaris/);
                    });
                } else {
                    expect(entry).not.toMatch(/@shopify\/polaris/);
                }
            }));
            it('omits Polaris globals and components when autoImportPolarisGlobals is disabled', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: false })]
                });
                const { entry } = yield config_1.default(workspace);
                expect(entry).not.toContainEqual(expect.stringContaining('global.scss'));
                expect(entry).not.toContainEqual(expect.stringContaining('components.scss'));
            }));
            it('includes Polaris components and globals when autoImportPolarisComponents is enabled', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: true })]
                });
                const { entry } = yield config_1.default(workspace);
                expect(entry).toContain('@shopify/polaris/styles/global.scss');
                expect(entry).toContain('@shopify/polaris/styles/components.scss');
            }));
            it('includes only polaris globals when autoImportPolarisComponents is ["global"]', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: ['global'] })]
                });
                const { entry } = yield config_1.default(workspace);
                expect(entry).toContain('@shopify/polaris/styles/global.scss');
                expect(entry).not.toContainEqual(expect.stringMatching('components.scss'));
            }));
            it('includes only polaris components when autoImportPolarisComponents is ["components"]', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: ['components'] })]
                });
                const { entry } = yield config_1.default(workspace);
                expect(entry).not.toContainEqual(expect.stringContaining('global.scss'));
                expect(entry).toContain('@shopify/polaris/styles/components.scss');
            }));
            it('include both polaris globals and components when autoImportPolarisComponents is ["global", "components"]', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'development' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: ['global', 'components'] })]
                });
                const { entry } = yield config_1.default(workspace);
                expect(entry).toContain('@shopify/polaris/styles/global.scss');
                expect(entry).toContain('@shopify/polaris/styles/components.scss');
            }));
            it.each([['development'], ['test']])('defaults to including Polaris Sass globals and components for %s clients', mode => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode }),
                    dependencies: utilities_1.createDependency('@shopify/polaris')
                });
                const config = yield config_1.default(workspace);
                expect(config.entry).toContain('@shopify/polaris/styles/global.scss');
                expect(config.entry).toContain('@shopify/polaris/styles/components.scss');
            }));
            it('defaults to including Polaris globals for production clients', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'production' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris')
                });
                const config = yield config_1.default(workspace);
                expect(config.entry).toContain('@shopify/polaris/esnext/styles/global.scss');
                expect(config.entry).not.toContainEqual(expect.stringContaining('components.scss'));
            }));
            // In production, webpack automatically includes/merges/tree-shakes relevant,
            // per-entrypoint Polaris CSS on component import.
            it('never imports Polaris components for production clients ', () => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'client', mode: 'production' }),
                    dependencies: utilities_1.createDependency('@shopify/polaris'),
                    plugins: [plugins.sass({ autoImportPolaris: ['global', 'components'] })]
                });
                const config = yield config_1.default(workspace);
                expect(config.entry).not.toContainEqual(expect.stringContaining('components.scss'));
            }));
            it.each([['development'], ['production'], ['test']])('omits Polaris Sass files for %s servers', mode => __awaiter(_this, void 0, void 0, function* () {
                const workspace = utilities_1.createWorkspace({
                    env: new env_1.default({ target: 'server', mode }),
                    dependencies: utilities_1.createDependency('@shopify/polaris')
                });
                const config = yield config_1.default(workspace);
                expect(config.entry).not.toContain(expect.stringContaining('@shopify/polaris'));
            }));
        });
    });
});