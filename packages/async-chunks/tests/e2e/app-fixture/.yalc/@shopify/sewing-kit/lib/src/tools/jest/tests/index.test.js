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
const path_1 = require("path");
const utilities_1 = require("tests/unit/utilities");
const __1 = require("..");
const plugins = require("../../../plugins");
const runner_1 = require("../../../runner");
jest.mock('../config', () => ({ default: jest.fn() }));
jest.mock('../jest', () => ({ default: { run: jest.fn() } }));
jest.mock('../../graphql', () => ({ default: jest.fn() }));
jest.mock('../../graphql-typescript-definitions', () => ({ default: jest.fn() }));
const mockConfig = require.requireMock('../config').default;
const { run: mockJest } = require.requireMock('../jest').default;
const mockBuildGraphQL = require.requireMock('../../graphql').default;
const mockBuildGraphQLTypeDefinitions = require.requireMock('../../graphql-typescript-definitions').default;
const originalBabelEnv = process.env.BABEL_ENV;
const originalNodeEnv = process.env.BABEL_ENV;
const originalCI = process.env.CI;
const originalCIRCLECI = process.env.CIRCLECI;
const originalShopifyBuildVersion = process.env.SHOPIFY_BUILD_VERSION;
describe('jest', () => {
    beforeEach(() => {
        mockConfig.mockClear();
        mockConfig.mockReturnValue({});
        mockJest.mockClear();
        mockBuildGraphQL.mockClear();
        mockBuildGraphQLTypeDefinitions.mockClear();
        process.env.BABEL_ENV = originalBabelEnv;
        process.env.NODE_ENV = originalNodeEnv;
        process.env.CI = 'false';
        process.env.CIRCLECI = 'false';
        delete process.env.SHOPIFY_BUILD_VERSION;
    });
    afterEach(() => {
        process.env.CI = originalCI;
        process.env.CIRCLECI = originalCIRCLECI;
        process.env.SHOPIFY_BUILD_VERSION = originalShopifyBuildVersion;
    });
    it('creates a config from the passed workspace and includes it as --config', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const config = { foo: 'bar' };
        mockConfig.mockReturnValueOnce(config);
        yield __1.default(workspace, {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('config', JSON.stringify(config));
    }));
    it('caches typescript transforms in a common CI cache location', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const cacheDir = path_1.join(workspace.paths.cache, 'jest');
        yield __1.default(workspace, {}, new runner_1.default());
        const command = utilities_1.parseCommand(mockJest.mock.calls[0][0]);
        expect(command).toHaveProperty('cacheDirectory', cacheDir);
    }));
    it('accepts cache directory override', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield __1.default(workspace, { cacheDirectory: 'lol' }, new runner_1.default());
        const command = utilities_1.parseCommand(mockJest.mock.calls[0][0]);
        expect(command).toHaveProperty('cacheDirectory', 'lol');
    }));
    it('includes a --watch flag by default when not in CI', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = 'false';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('watch');
    }));
    it('does not include a --watch flag by default when in CI', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = 'true';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('watch');
    }));
    it('uses the passed watch option', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), { watch: false }, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('watch');
    }));
    it('runs only changed files when not in CI', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('onlyChanged', true);
    }));
    it('runs on all files in CI', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = 'true';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('onlyChanged');
    }));
    it('does not limit worker count by default', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('maxWorkers');
    }));
    it('limits worker count for shopify-build', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = 'true';
        process.env.SHOPIFY_BUILD_VERSION = '1';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('maxWorkers', 3);
    }));
    it('limits worker count for Circle CI', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = '1';
        process.env.CIRCLECI = 'true';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('maxWorkers', 3);
    }));
    it('accepts maxWorker override', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.SHOPIFY_BUILD_VERSION = '1';
        yield __1.default(utilities_1.createWorkspace(), { maxWorkers: 8 }, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('maxWorkers', 8);
    }));
    it('does not force exit by default', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('forceExit');
    }));
    it('forces exit for CI', () => __awaiter(_this, void 0, void 0, function* () {
        process.env.CI = 'true';
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('forceExit', true);
    }));
    describe('debug mode', () => {
        it('forces exit and runs in band', () => __awaiter(_this, void 0, void 0, function* () {
            yield __1.default(utilities_1.createWorkspace(), { debug: true }, new runner_1.default());
            const command = utilities_1.parseCommand(mockJest.mock.calls[0][0]);
            expect(command).toHaveProperty('forceExit', true);
            expect(command).toHaveProperty('runInBand', true);
        }));
        it('ignores maxWorker because it conflicts with runInBand', () => __awaiter(_this, void 0, void 0, function* () {
            process.env.CI = '1';
            process.env.CIRCLECI = 'true';
            yield __1.default(utilities_1.createWorkspace(), { debug: true }, new runner_1.default());
            expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('maxWorkers');
        }));
    });
    it('passes along any directory restrictions to the config', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const options = { testDirectories: ['foo'] };
        yield __1.default(workspace, options, new runner_1.default());
        expect(mockConfig).toHaveBeenCalledWith(workspace, options);
    }));
    it('runs all tests by default', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('testPathPattern');
    }));
    it('runs only the tests specified by testRegex', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), { testRegex: 'foo' }, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('testPathPattern', 'foo');
    }));
    it('checks unchanged files when a testRegex is passed', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), { testRegex: 'foo' }, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('onlyChanged');
        // --watch sets --onlyChanged by default
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('watch');
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('watchAll', true);
    }));
    it('builds GraphQL ahead of time for GraphQL projects', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace({
            plugins: [plugins.graphql({ schema: './mock-schema.json' })]
        });
        const runner = new runner_1.default();
        yield __1.default(workspace, {}, runner);
        expect(mockBuildGraphQL).toHaveBeenCalledWith(workspace, runner);
        expect(mockBuildGraphQLTypeDefinitions).toHaveBeenCalledWith(workspace, { watch: false }, runner);
    }));
    it('does not call coverage by default', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), {}, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).not.toHaveProperty('coverage');
    }));
    it('uses the passed coverage option', () => __awaiter(_this, void 0, void 0, function* () {
        yield __1.default(utilities_1.createWorkspace(), { coverage: true }, new runner_1.default());
        expect(utilities_1.parseCommand(mockJest.mock.calls[0][0])).toHaveProperty('coverage');
    }));
});