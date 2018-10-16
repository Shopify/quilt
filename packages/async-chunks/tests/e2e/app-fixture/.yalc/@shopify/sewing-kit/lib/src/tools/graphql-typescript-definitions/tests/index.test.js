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
const graphql_typescript_definitions_1 = require("graphql-typescript-definitions");
const utilities_1 = require("tests/unit/utilities");
const __1 = require("..");
const runner_1 = require("../../../runner");
const plugins_1 = require("../../../plugins");
const utilities_2 = require("../../utilities");
jest.mock('child_process', () => ({ execSync: jest.fn() }));
jest.mock('graphql-typescript-definitions', () => Object.assign({}, require.requireActual('graphql-typescript-definitions'), { Builder: jest.fn(function MockBuilder() {
        // This is a weird one because we need to make this behave as
        // if it were a class constructor, given that it is vending
        // instances in place of the mocked class.
        this.on = jest.fn();
        this.once = jest.fn((_, handler) => handler());
        this.run = jest.fn();
    }) }));
jest.mock('../clean', () => {
    return { default: jest.fn() };
});
jest.mock('../../graphql', () => {
    return { default: jest.fn() };
});
const { execSync } = require.requireMock('child_process');
const { Builder } = require.requireMock('graphql-typescript-definitions');
const clean = require.requireMock('../clean').default;
const buildGraphQL = require.requireMock('../../graphql').default;
describe('graphql-typescript-definitions', () => {
    beforeEach(() => {
        execSync.mockClear();
        clean.mockClear();
        buildGraphQL.mockClear();
        Builder.mockClear();
    });
    it('runs the TypeScript definition builder', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        yield __1.default(workspace, {}, new runner_1.default());
        expect(Builder).toHaveBeenCalledWith({
            cwd: workspace.paths.root,
            addTypename: true,
            enumFormat: graphql_typescript_definitions_1.EnumFormat.PascalCase,
            schemaTypesPath: utilities_2.graphQLSchemaTypesPath(workspace)
        });
        expect(Builder.mock.instances[0].run).toHaveBeenCalledWith({ watch: false });
    }));
    it('runs the the TypeScript definition builder in watch mode when the option is true', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        yield __1.default(workspace, { watch: true }, new runner_1.default());
        expect(Builder.mock.instances[0].run).toHaveBeenCalledWith({ watch: true });
    }));
    it('cleans existing definitions before running', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        const runner = new runner_1.default();
        yield __1.default(workspace, {}, runner);
        expect(clean).toHaveBeenCalledWith(workspace, runner);
    }));
    it('builds the schema before running', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        const runner = new runner_1.default();
        yield __1.default(workspace, {}, runner);
        expect(buildGraphQL).toHaveBeenCalledWith(workspace, runner);
    }));
    it('does not run if it has already run', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        const runner = new runner_1.default();
        yield __1.default(workspace, {}, runner);
        yield __1.default(workspace, {}, runner);
        expect(Builder).toHaveBeenCalledTimes(1);
    }));
    it('does not run if it does not use TypeScript', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace({ typescript: false });
        yield __1.default(workspace, {}, new runner_1.default());
        expect(execSync).not.toHaveBeenCalled();
    }));
    it('does not run if it does not use GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace({ graphql: false });
        yield __1.default(workspace, {}, new runner_1.default());
        expect(execSync).not.toHaveBeenCalled();
    }));
});
function createFullWorkspace({ graphql: addGraphQL = true, typescript = true } = {}) {
    return utilities_1.createWorkspace({
        plugins: addGraphQL ? [plugins_1.graphql({
            schema: { production: 'https://mock.api' }
        })] : [],
        devDependencies: typescript ? utilities_1.createDependency('typescript') : {}
    });
}