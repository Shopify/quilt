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
const verify_typescript_task_1 = require("../verify-typescript-task");
jest.mock('fs-extra');
const { pathExists } = require.requireMock('fs-extra');
describe('verifyTypescript', () => {
    afterEach(() => {
        pathExists.mockReset();
    });
    it('only runs once when called multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        const runner = new utilities_1.FakeRunner();
        runner.hasPerformed = jest.fn(() => true);
        yield verify_typescript_task_1.default(utilities_1.createWorkspace(), runner);
        expect(pathExists).not.toHaveBeenCalled();
        expect(runner.failed).toBe(false);
        expect(runner.output).toBe('');
    }));
    describe('with typescript dependency', () => {
        it('resolves when there is a tsconfig.json', () => __awaiter(_this, void 0, void 0, function* () {
            pathExists.mockImplementation(path => Promise.resolve(path.endsWith('/index.ts') || path.endsWith('/tsconfig.json')));
            const runner = new utilities_1.FakeRunner();
            yield verify_typescript_task_1.default(utilities_1.createWorkspace({ devDependencies: { typescript: '3.0' } }), runner);
            expect(pathExists).toHaveBeenCalled();
            expect(runner.failed).toBe(false);
            expect(runner.output).toBe('');
        }));
        it('fails when there is no tsconfig.json', () => __awaiter(_this, void 0, void 0, function* () {
            pathExists.mockImplementation(() => Promise.resolve(false));
            const runner = new utilities_1.FakeRunner();
            const workspace = utilities_1.createWorkspace({ devDependencies: { typescript: '3.0' } });
            yield verify_typescript_task_1.default(workspace, runner);
            expect(pathExists).toHaveBeenCalled();
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(verify_typescript_task_1.noTSConfig(workspace.root).message);
        }));
    });
    describe('without typescript dependency', () => {
        it('resolves when there is no index.ts(x)', () => __awaiter(_this, void 0, void 0, function* () {
            pathExists.mockImplementation(() => false);
            const runner = new utilities_1.FakeRunner();
            yield verify_typescript_task_1.default(utilities_1.createWorkspace(), runner);
            expect(pathExists).toHaveBeenCalled();
            expect(runner.failed).toBe(false);
            expect(runner.output).toBe('');
        }));
        it.each([['/index.ts'], ['/index.tsx'], ['/app/index.ts'], ['/app/index.tsx'], ['/client/index.ts'], ['/client/index.tsx']])('fails with an error there there is a %s', indexPath => __awaiter(_this, void 0, void 0, function* () {
            pathExists.mockImplementation(path => Promise.resolve(path.endsWith(indexPath)));
            const runner = new utilities_1.FakeRunner();
            yield verify_typescript_task_1.default(utilities_1.createWorkspace(), runner);
            expect(pathExists).toBeCalled();
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(verify_typescript_task_1.TS_INDEX_WITHOUT_TS);
        }));
    });
});