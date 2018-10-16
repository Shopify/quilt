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
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const clean_1 = require("../clean");
const utilities_2 = require("../utilities");
const utilities_3 = require("../../utilities");
const runner_1 = require("../../../runner");
const plugins_1 = require("../../../plugins");
jest.mock('fs-extra', () => Object.assign({}, require.requireActual('fs-extra'), { remove: jest.fn(require.requireActual('fs-extra').remove) }));
const { remove } = require.requireMock('fs-extra');
describe('graphql', () => {
    beforeEach(() => {
        remove.mockClear();
    });
    it('removes the JSON and IDL schema files', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            yield createSchemaFiles(workspace);
            yield clean_1.default(workspace, new runner_1.default());
            expect((yield fs_extra_1.pathExists(utilities_3.graphQLSchemaPath(workspace)))).toBe(false);
            expect((yield fs_extra_1.pathExists(utilities_2.graphQLUnionAndInterfacesPath(workspace)))).toBe(false);
            expect((yield fs_extra_1.pathExists(utilities_3.graphQLSchemaPath(workspace, true)))).toBe(false);
        }));
    }));
    it('only runs once when called multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = createGraphQLWorkspace(dir);
            const runner = new runner_1.default();
            yield createSchemaFiles(workspace);
            yield clean_1.default(workspace, runner);
            yield createSchemaFiles(workspace);
            yield clean_1.default(workspace, runner);
            expect((yield fs_extra_1.pathExists(utilities_3.graphQLSchemaPath(workspace)))).toBe(true);
            expect((yield fs_extra_1.pathExists(utilities_2.graphQLUnionAndInterfacesPath(workspace)))).toBe(true);
            expect((yield fs_extra_1.pathExists(utilities_3.graphQLSchemaPath(workspace, true)))).toBe(true);
        }));
    }));
    it('is skipped when a GraphQL schema is not specified', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('graphql', dir => __awaiter(this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace({ root: dir });
            yield clean_1.default(workspace, new runner_1.default());
            expect(remove).not.toBeCalled();
        }));
    }));
});
function createSchemaFiles(workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(path_1.dirname(utilities_3.graphQLSchemaPath(workspace)));
        yield Promise.all([fs_extra_1.writeFile(utilities_3.graphQLSchemaPath(workspace), ''), fs_extra_1.writeFile(utilities_2.graphQLUnionAndInterfacesPath(workspace), ''), fs_extra_1.writeFile(utilities_3.graphQLSchemaPath(workspace, true), '')]);
    });
}
function createGraphQLWorkspace(privateDir) {
    return utilities_1.createWorkspace({
        root: privateDir,
        plugins: [plugins_1.graphql({
            schema: { production: 'https://mock.api' }
        })]
    });
}