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
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("tests/unit/utilities");
const graphql_1 = require("../graphql");
const runner_1 = require("../../../runner");
const plugins_1 = require("../../../plugins");
jest.mock('child_process', () => ({
    exec: jest.fn((_command, options, callback) => {
        if (typeof options === 'function') {
            return options();
        }
        return callback();
    })
}));
jest.mock('../../graphql', () => ({ default: jest.fn() }));
const { exec } = require.requireMock('child_process');
const buildGraphQL = require.requireMock('../../graphql').default;
describe('graphql lint', () => {
    beforeEach(() => {
        exec.mockClear();
        buildGraphQL.mockClear();
    });
    it('calls ESLint with command line arguments targetting GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('eslint-graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            yield graphql_1.default(workspace, new runner_1.default());
            expect(exec.mock.calls[0][0]).toMatch(/\.bin\/eslint.* --ext \.graphql/);
        }));
    }));
    it('calls ESLint with a custom config that runs the GraphQL plugin', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('eslint-graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            yield graphql_1.default(workspace, new runner_1.default());
            const { config } = utilities_1.parseCommand(exec.mock.calls[0][0]);
            expect((yield fs_extra_1.readJSON(config))).toEqual({
                extends: ['plugin:shopify/graphql']
            });
        }));
    }));
    it('builds the graphQL schema before running', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('eslint-graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const runner = new runner_1.default();
            const workspace = createGraphQLWorkspace(dir);
            yield graphql_1.default(workspace, runner);
            expect(buildGraphQL).toHaveBeenCalledWith(workspace, runner);
        }));
    }));
    it('only runs once when called multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('eslint-graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const runner = new runner_1.default();
            const workspace = createGraphQLWorkspace(dir);
            yield graphql_1.default(workspace, runner);
            yield graphql_1.default(workspace, runner);
            expect(exec).toHaveBeenCalledTimes(1);
        }));
    }));
    it('does not run if the user is not using GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield graphql_1.default(workspace, new runner_1.default());
        expect(exec).not.toHaveBeenCalled();
    }));
});
function createGraphQLWorkspace(privateDir) {
    return utilities_1.createWorkspace({
        plugins: [plugins_1.graphql({
            schema: { production: 'https://mock.api' }
        })],
        paths: { private: privateDir }
    });
}