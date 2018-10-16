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
const graphql_1 = require("graphql");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("tests/unit/utilities");
const __1 = require("..");
const utilities_2 = require("../utilities");
const utilities_3 = require("../../utilities");
const env_1 = require("../../../env");
const runner_1 = require("../../../runner");
const plugins_1 = require("../../../plugins");
jest.mock('../utilities', () => Object.assign({}, require.requireActual('../utilities'), { getUnionsAndInterfacesFromInstrospection: jest.fn(() => []), loadProductionSchema: jest.fn(), loadSchema: jest.fn() }));
jest.mock('../clean', () => ({ default: jest.fn() }));
const { loadProductionSchema, loadSchema, getUnionsAndInterfacesFromInstrospection } = require.requireMock('../utilities');
const clean = require.requireMock('../clean').default;
const MOCK_PRODUCTION_ENDPOINT = 'https://api.mock.com';
const MOCK_DEVELOPMENT_ENDPOINT = 'https://api.mock.io';
const MOCK_SCHEMA = graphql_1.buildSchema(`
  type Person { name: String! }
  type Query {
    person: Person!
  }
`);
const originalCIValue = process.env.CI;
describe('graphql', () => {
    beforeEach(() => {
        clean.mockClear();
        loadProductionSchema.mockClear();
        loadSchema.mockClear();
        getUnionsAndInterfacesFromInstrospection.mockClear();
        process.env.CI = '0';
    });
    afterEach(() => {
        process.env.CI = originalCIValue;
    });
    describe.each([['production'], ['staging']])('%s', mode => {
        it('fetches the production schema', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode,
                    addLocalSchemaEndpoint: true
                });
                mockLoadProductionSchema(MOCK_SCHEMA);
                yield __1.default(workspace, new runner_1.default());
                expect(loadSchema).not.toHaveBeenCalled();
                expect(loadProductionSchema).toHaveBeenCalledWith(MOCK_PRODUCTION_ENDPOINT);
            }));
        }));
        it('retries schema fetch once', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, { mode });
                loadProductionSchema.mockImplementationOnce(() => {
                    throw new Error('schema download failed');
                });
                loadProductionSchema.mockImplementationOnce(() => graphql_1.graphql(MOCK_SCHEMA, graphql_1.introspectionQuery));
                yield __1.default(workspace, new runner_1.default());
                expect(loadProductionSchema).toHaveBeenCalledTimes(2);
            }));
        }));
        it('fails on multiple failed GraphQL schema fetches', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, { mode });
                loadProductionSchema.mockImplementation(() => {
                    throw new Error('schema download failed');
                });
                // eslint-disable-next-line no-warning-comments
                // TODO: rewrite to use expect.toThrow or expect.reject.toThrow.
                let schemaDownloaded = false;
                try {
                    yield __1.default(workspace, new utilities_1.FakeRunner());
                    schemaDownloaded = true;
                } catch (error) {
                    // This is supposed to happen.
                } finally {
                    expect(schemaDownloaded).toBe(false);
                }
            }));
        }));
    });
    describe('ci', () => {
        it('does not try to fetch development schema in CI', () => __awaiter(_this, void 0, void 0, function* () {
            process.env.CI = '1';
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode: 'test',
                    addLocalSchemaEndpoint: true
                });
                mockLoadProductionSchema(MOCK_SCHEMA);
                yield __1.default(workspace, new runner_1.default());
                expect(loadProductionSchema).toHaveBeenCalledTimes(1);
                expect(loadProductionSchema).toHaveBeenCalledWith(MOCK_PRODUCTION_ENDPOINT);
                expect(loadSchema).not.toHaveBeenCalled();
            }));
        }));
    });
    it('writes the schema JSON file', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            mockLoadProductionSchema(MOCK_SCHEMA);
            yield __1.default(workspace, new runner_1.default());
            expect((yield fs_extra_1.readFile(utilities_3.graphQLSchemaPath(workspace), 'utf8'))).toBe(JSON.stringify((yield graphql_1.graphql(MOCK_SCHEMA, graphql_1.introspectionQuery)), null, 2));
        }));
    }));
    it('writes the schema IDL file', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            mockLoadProductionSchema(MOCK_SCHEMA);
            yield __1.default(workspace, new runner_1.default());
            expect((yield fs_extra_1.readFile(utilities_3.graphQLSchemaPath(workspace, true), 'utf8'))).toBe(graphql_1.printSchema(MOCK_SCHEMA));
        }));
    }));
    it('writes the unions and interfaces JSON file', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            mockLoadProductionSchema(MOCK_SCHEMA);
            yield __1.default(workspace, new runner_1.default());
            expect(getUnionsAndInterfacesFromInstrospection).toHaveBeenCalledWith((yield graphql_1.graphql(MOCK_SCHEMA, graphql_1.introspectionQuery)));
            expect((yield fs_extra_1.readFile(utilities_2.graphQLUnionAndInterfacesPath(workspace), 'utf8'))).toBe(JSON.stringify(getUnionsAndInterfacesFromInstrospection(), null, 2));
        }));
    }));
    it('cleans up existing graphQL before it runs', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            mockLoadProductionSchema(MOCK_SCHEMA);
            yield __1.default(workspace, new runner_1.default());
            expect(clean).toHaveBeenCalled();
        }));
    }));
    it('only runs once when called multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            const runner = new runner_1.default();
            mockLoadProductionSchema(MOCK_SCHEMA);
            yield __1.default(workspace, runner);
            yield __1.default(workspace, runner);
            expect(loadProductionSchema).toHaveBeenCalledTimes(1);
        }));
    }));
    it('does not run if the user is not using GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield __1.default(workspace, new runner_1.default());
        expect(loadProductionSchema).not.toHaveBeenCalled();
    }));
    describe.each([['development'], ['test']])('%s', mode => {
        it('uses the production schema when no local schema is provided', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode,
                    addLocalSchemaEndpoint: false
                });
                mockLoadProductionSchema(MOCK_SCHEMA);
                yield __1.default(workspace, new runner_1.default());
                expect(loadProductionSchema).toHaveBeenCalled();
                expect(loadSchema).not.toHaveBeenCalled();
            }));
        }));
        it('uses the development schema when provided', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode,
                    addLocalSchemaEndpoint: true
                });
                mockLoadSchema(MOCK_SCHEMA);
                yield __1.default(workspace, new runner_1.default());
                expect(loadSchema).toHaveBeenCalledWith(MOCK_DEVELOPMENT_ENDPOINT);
                expect(loadProductionSchema).not.toHaveBeenCalledWith();
            }));
        }));
        it('falls back to the production schema when the local one fails', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode,
                    addLocalSchemaEndpoint: true
                });
                loadSchema.mockImplementation(endpoint => {
                    return endpoint === MOCK_DEVELOPMENT_ENDPOINT ? Promise.reject(new Error()) : graphql_1.graphql(MOCK_SCHEMA, graphql_1.introspectionQuery);
                });
                yield __1.default(workspace, new runner_1.default());
                expect(loadSchema).toHaveBeenNthCalledWith(1, MOCK_DEVELOPMENT_ENDPOINT);
                expect(loadSchema).toHaveBeenNthCalledWith(2, MOCK_PRODUCTION_ENDPOINT);
                expect(loadProductionSchema).not.toHaveBeenCalledWith();
            }));
        }));
        it('rethrows the error when no endpoint is available', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
                const workspace = createGraphQLWorkspace(dir, {
                    mode,
                    addLocalSchemaEndpoint: true
                });
                const error = new Error();
                loadSchema.mockImplementation(() => Promise.reject(error));
                expect(__1.default(workspace, new runner_1.default())).rejects.toBe(error);
            }));
        }));
    });
});
function mockLoadSchema(schema) {
    loadSchema.mockImplementation(() => graphql_1.graphql(schema, graphql_1.introspectionQuery));
}
function mockLoadProductionSchema(schema) {
    loadProductionSchema.mockImplementation(() => graphql_1.graphql(schema, graphql_1.introspectionQuery));
}
function createGraphQLWorkspace(privateDir, { mode = 'production', addLocalSchemaEndpoint = true } = {}) {
    const graphQLPlugin = plugins_1.graphql({
        schema: {
            production: MOCK_PRODUCTION_ENDPOINT,
            development: addLocalSchemaEndpoint ? MOCK_DEVELOPMENT_ENDPOINT : undefined
        }
    });
    return utilities_1.createWorkspace({
        env: new env_1.default({ mode: mode }),
        root: privateDir,
        plugins: [graphQLPlugin]
    });
}