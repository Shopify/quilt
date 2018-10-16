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
const config_1 = require("../config");
const plugins = require("../../../plugins");
const jestPath = path.resolve(__dirname, '../../../../jest');
const jestTransformPath = path.join(jestPath, 'transformers');
describe('jestConfig()', () => {
    describe('rootDir', () => {
        it('uses the root of the workspace', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).toHaveProperty('rootDir', workspace.root);
        }));
    });
    describe('roots', () => {
        it('specifies no roots by default', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace()))).not.toHaveProperty('roots');
        }));
        it('adds roots for any directories that are specified in `testDirectories`', () => __awaiter(_this, void 0, void 0, function* () {
            const testDirectories = ['foo/bar/baz'];
            expect((yield config_1.default(utilities_1.createWorkspace(), { testDirectories }))).toHaveProperty('roots', testDirectories);
        }));
    });
    describe('setupFiles', () => {
        it('includes the polyfills file', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace()))).toHaveProperty('setupFiles', [path.join(jestPath, 'polyfills.js')]);
        }));
    });
    describe('moduleFileExtensions', () => {
        it('includes .js and .json if the project does not use TypeScript', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).toHaveProperty('moduleFileExtensions', ['js', 'json']);
        }));
        it('includes TypeScript files if the project uses TypeScript', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({
                devDependencies: utilities_1.createDependency('typescript')
            });
            expect((yield config_1.default(workspace))).toHaveProperty('moduleFileExtensions', ['ts', 'tsx', 'js', 'json']);
        }));
    });
    describe('testRegex', () => {
        it('matches all .test files', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace()))).toHaveProperty('testRegex', '.*\\.(test|integration)\\.(js|ts)x?$');
        }));
    });
    describe('transform', () => {
        it('adds transforms for all supported file types', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace()))).toHaveProperty('transform', {
                '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$': path.join(jestTransformPath, 'file.js'),
                '\\.jsx?$': path.join(jestTransformPath, 'javascript.js')
            });
        }));
        it('adds the custom SVG transform when using Polaris', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({
                dependencies: utilities_1.createDependency('@shopify/polaris')
            })))).toHaveProperty('transform', {
                '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$': path.join(jestTransformPath, 'file.js'),
                '\\.svg$': path.join(jestTransformPath, 'svg.js'),
                '\\.jsx?$': path.join(jestTransformPath, 'javascript.js')
            });
        }));
        it('adds a TypeScript transform when the project uses TypeScript', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({
                devDependencies: utilities_1.createDependency('typescript')
            })))).toHaveProperty('transform', {
                '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$': path.join(jestTransformPath, 'file.js'),
                '\\.jsx?$': path.join(jestTransformPath, 'javascript.js'),
                '\\.tsx?$': require.resolve('ts-jest/preprocessor.js')
            });
        }));
        it('adds a GraphQL transform when the project uses GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({
                plugins: [plugins.graphql({ schema: './mock-schema.json' })]
            })))).toHaveProperty('transform', {
                '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv|ico)$': path.join(jestTransformPath, 'file.js'),
                '\\.jsx?$': path.join(jestTransformPath, 'javascript.js'),
                '\\.(gql|graphql)$': require.resolve('jest-transform-graphql')
            });
        }));
    });
    describe('modulePaths', () => {
        it('adds the app and packages paths as modulePaths', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).toHaveProperty('modulePaths', ['<rootDir>/app', '<rootDir>/packages']);
        }));
        it('does not include packages when they don’t exist', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({
                paths: { packages: undefined }
            });
            expect((yield config_1.default(workspace))).toHaveProperty('modulePaths', ['<rootDir>/app']);
        }));
    });
    describe('moduleNameMapper', () => {
        it('adds a mapping for CSS/ Sass files and the test directory', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).toHaveProperty('moduleNameMapper', {
                '\\.s?css$': path.join(jestTransformPath, 'styles.js'),
                '^tests/(.*)': path.join(workspace.paths.tests, '$1')
            });
        }));
    });
    describe('testURL', () => {
        it('leaves the default when no URL value is provided by a plugin', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).not.toHaveProperty('testURL');
        }));
    });
    describe('globals', () => {
        describe('ts-jest', () => {
            function getTSJestConfig(jestConfig) {
                return jestConfig.globals['ts-jest'];
            }
            it('only defines ts-jest globals for TypeScript projects', () => __awaiter(_this, void 0, void 0, function* () {
                expect((yield config_1.default(utilities_1.createWorkspace()))).not.toHaveProperty('globals.ts-jest');
            }));
            it('sets ts-jest to use a Babel config that works with Jest', () => __awaiter(_this, void 0, void 0, function* () {
                const tsJestConfig = getTSJestConfig((yield config_1.default(utilities_1.createWorkspace({
                    devDependencies: utilities_1.createDependency('typescript')
                }))));
                expect(tsJestConfig).toHaveProperty('useBabelrc', false);
                expect(tsJestConfig).toHaveProperty('babelConfig', {
                    presets: [['shopify/node', { modules: 'commonjs' }]],
                    plugins: ['system-import-transformer'],
                    sourceMaps: 'inline'
                });
            }));
            it('sets ts-jest’s Babel config to use React in a React project', () => __awaiter(_this, void 0, void 0, function* () {
                const tsJestConfig = getTSJestConfig((yield config_1.default(utilities_1.createWorkspace({
                    dependencies: utilities_1.createDependency('react'),
                    devDependencies: utilities_1.createDependency('typescript')
                }))));
                expect(tsJestConfig).toHaveProperty('babelConfig.presets.1', 'shopify/react');
            }));
            it('sets ts-jest’s Babel config to use Preact in a Preact project', () => __awaiter(_this, void 0, void 0, function* () {
                const tsJestConfig = getTSJestConfig((yield config_1.default(utilities_1.createWorkspace({
                    dependencies: utilities_1.createDependency('preact'),
                    devDependencies: utilities_1.createDependency('typescript')
                }))));
                expect(tsJestConfig).toHaveProperty('babelConfig.presets.1', ['shopify/react', { pragma: 'h' }]);
            }));
        });
    });
    describe('collectCoverageFrom', () => {
        it('defaults to collecting coverage from project paths', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            const expectedPaths = ['client/**/*.{js,jsx,ts,tsx}', '!client/**/index.{js,jsx,ts,tsx}', 'server/**/*.{js,jsx,ts,tsx}', '!server/**/index.{js,jsx,ts,tsx}', 'app/**/*.{js,jsx,ts,tsx}', '!app/**/index.{js,jsx,ts,tsx}'];
            expect((yield config_1.default(workspace))).toHaveProperty('collectCoverageFrom', expectedPaths);
        }));
    });
    describe('collectCoverage', () => {
        it('defaults to not collecting coverage', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).toHaveProperty('collectCoverage', false);
        }));
    });
    describe('coverageDirectory', () => {
        it('defaults to not specifying a coverage directory', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            expect((yield config_1.default(workspace))).not.toHaveProperty('coverageDirectory');
        }));
    });
    describe('allows custom configurations', () => {
        it('extends the config using a custom function', () => __awaiter(_this, void 0, void 0, function* () {
            const setupTestFrameworkScriptFile = path.resolve(__dirname, 'before-each.js');
            const collectCoverage = true;
            const collectCoverageFrom = ['!app/config/**/*'];
            const coverageDirectory = 'app';
            const testURL = 'https://shopify.com';
            let setupFiles;
            const workspace = utilities_1.createWorkspace({
                plugins: [plugins.jest(config => {
                    setupFiles = (config.setupFiles || []).concat(path.resolve(__dirname, 'setup-my-tests.tsx'));
                    const custom = {
                        collectCoverage,
                        collectCoverageFrom,
                        coverageDirectory,
                        setupTestFrameworkScriptFile,
                        testURL,
                        setupFiles
                    };
                    return Object.assign({}, config, custom);
                })]
            });
            expect((yield config_1.default(workspace))).toMatchObject({
                collectCoverage,
                collectCoverageFrom,
                coverageDirectory,
                setupTestFrameworkScriptFile,
                testURL,
                setupFiles
            });
        }));
    });
});