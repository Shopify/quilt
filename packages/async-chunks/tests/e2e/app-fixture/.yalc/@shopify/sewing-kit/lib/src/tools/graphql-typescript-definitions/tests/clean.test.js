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
const runner_1 = require("../../../runner");
const plugins_1 = require("../../../plugins");
const clean_1 = require("../clean");
const utilities_2 = require("../../utilities");
jest.mock('child_process', () => ({ execSync: jest.fn() }));
const { execSync } = require.requireMock('child_process');
describe('graphql-typescript-definitions clean', () => {
    beforeEach(() => {
        execSync.mockClear();
    });
    it('deletes stale operation type definitions', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        yield clean_1.default(workspace, new runner_1.default());
        expect(execSync).toHaveBeenNthCalledWith(1, `find ${utilities_2.projectSourceDirectories(workspace).join(' ')} -name '*.graphql.d.ts' -delete`, { stdio: 'inherit' });
    }));
    it('deletes stale schema types', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        yield clean_1.default(workspace, new runner_1.default());
        expect(execSync).toHaveBeenNthCalledWith(2, `find ${utilities_2.appTypesPath(workspace)} -name 'graphql.ts' -delete`, { stdio: 'inherit' });
        expect(execSync).toHaveBeenNthCalledWith(3, `find ${utilities_2.graphQLSchemaTypesPath(workspace)} -name '*types.ts' -delete`, { stdio: 'inherit' });
    }));
    it('does not run if it has already run', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace();
        const runner = new runner_1.default();
        yield clean_1.default(workspace, runner);
        yield clean_1.default(workspace, runner);
        expect(execSync).toHaveBeenCalledTimes(3);
    }));
    it('does not run if it does not use TypeScript', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace({ typescript: false });
        yield clean_1.default(workspace, new runner_1.default());
        expect(execSync).not.toHaveBeenCalled();
    }));
    it('does not run if it does not use GraphQL', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = createFullWorkspace({ graphql: false });
        yield clean_1.default(workspace, new runner_1.default());
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