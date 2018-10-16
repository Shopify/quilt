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
const __1 = require("..");
const runner_1 = require("../../../runner");
jest.mock('child_process', () => ({
    exec: jest.fn((_command, callback) => {
        return callback();
    })
}));
const { exec } = require.requireMock('child_process');
describe('prettier', () => {
    beforeEach(() => {
        exec.mockClear();
    });
    it('executes the prettier binary', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default(new runner_1.Logger(runner_1.Verbosity.error));
        yield __1.runPrettierLint(workspace, runner, { json: true });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('executable', '/node_modules/.bin/prettier');
    }));
    it('uses the file type specified', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.runPrettierLint(workspace, runner, {
            json: true
        });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('positionalArgs', ['./**/*.json']);
    }));
    it('uses multiple file types specified', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.runPrettierLint(workspace, runner, {
            json: true,
            graphql: true,
            markdown: true
        });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('positionalArgs', ['./**/*.{json,graphql,gql,md}']);
    }));
    it('uses --list-different', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.runPrettierLint(workspace, runner, { json: true });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('list-different', true);
        expect(utilities_1.parseCommand(command)).not.toHaveProperty('write');
    }));
    it('does not call Prettier when no file types are requested', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.runPrettierLint(workspace, runner, {});
        expect(exec).not.toHaveBeenCalled();
    }));
    it('does not run multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.runPrettierLint(workspace, runner, { json: true });
        yield __1.runPrettierLint(workspace, runner, { json: true });
        expect(exec).toHaveBeenCalledTimes(1);
    }));
    it('includes --show-expected guidance by default', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new utilities_1.FakeRunner();
        exec.mockImplementationOnce((_executable, callback) => {
            const err = new Error();
            err.stdout = 'fake invalid files';
            callback(err);
        });
        yield __1.runPrettierLint(workspace, runner, { json: true });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(runner.output).toMatch('yarn run sewing-kit lint --show-expected');
        expect(utilities_1.parseCommand(command)).toHaveProperty('list-different', true);
        expect(utilities_1.parseCommand(command)).not.toHaveProperty('write');
    }));
    it('omits --show-expected guidance if it was already requested', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new utilities_1.FakeRunner();
        exec.mockImplementationOnce((_executable, callback) => {
            const err = new Error();
            err.stdout = 'fake invalid files';
            callback(err);
        });
        yield __1.runPrettierLint(workspace, runner, { json: true, showExpected: true });
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(runner.output).not.toMatch('yarn run sewing-kit lint --show-expected');
        expect(utilities_1.parseCommand(command)).toHaveProperty('list-different', true);
        expect(utilities_1.parseCommand(command)).not.toHaveProperty('write');
    }));
});