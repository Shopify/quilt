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
    exec: jest.fn((_command, options, callback) => {
        if (typeof options === 'function') {
            return options();
        }
        return callback(null, { stdout: '', stderr: '' });
    })
}));
const { exec } = require.requireMock('child_process');
describe('stylelint', () => {
    afterEach(() => {
        exec.mockClear();
    });
    it('executes the stylelint binary', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield __1.default(workspace, new utilities_1.FakeRunner());
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('executable', '/node_modules/.bin/stylelint');
    }));
    it('ignores .scss in node_modules using stylelint', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield __1.default(workspace, new utilities_1.FakeRunner());
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('ignore-pattern', ['node_modules', 'vendor/bundle']);
    }));
    it('lints all .scss files in the project using stylelint', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        yield __1.default(workspace, new utilities_1.FakeRunner());
        const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
        expect(utilities_1.parseCommand(command)).toHaveProperty('positionalArgs', ['./**/*.scss']);
    }));
    it('does not run if it has already run', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new runner_1.default();
        yield __1.default(workspace, runner);
        yield __1.default(workspace, runner);
        expect(exec).toHaveBeenCalledTimes(1);
    }));
    describe('with runFixer', () => {
        it('executes the stylelint binary with --fix', () => __awaiter(_this, void 0, void 0, function* () {
            const workspace = utilities_1.createWorkspace();
            const runner = new utilities_1.FakeRunner();
            yield __1.default(workspace, runner, { runFixer: true });
            const command = utilities_1.stripString(workspace.paths.sewingKit, exec.mock.calls[0][0]);
            expect(utilities_1.parseCommand(command)).toHaveProperty('executable', '/node_modules/.bin/stylelint');
            expect(utilities_1.parseCommand(command)).toHaveProperty('fix');
            expect(utilities_1.parseCommand(command)).toHaveProperty('ignore-pattern', ['node_modules', 'vendor/bundle']);
        }));
    });
    it('exits when style violations are detected', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new utilities_1.FakeRunner();
        exec.mockImplementationOnce((_executable, _options, callback) => {
            const err = new Error();
            err.stdout = '';
            callback(err);
        });
        yield __1.default(workspace, runner, { runFixer: true });
        expect(runner.failed).toBe(true);
    }));
    it('outputs the first line of the error by default when violations are detected', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new utilities_1.FakeRunner();
        const multilineError = `relevant_out_message
			irrelevant_out_message
		`;
        exec.mockImplementationOnce((_executable, _options, callback) => {
            const err = new Error();
            err.stdout = multilineError;
            err.stderr = 'err_message';
            callback(err);
        });
        yield __1.default(workspace, runner, { runFixer: true });
        expect(runner.output).toMatch('relevant_out_message');
        expect(runner.output).not.toMatch(multilineError);
    }));
    it('outputs the entire error when rule violations are detected', () => __awaiter(_this, void 0, void 0, function* () {
        const workspace = utilities_1.createWorkspace();
        const runner = new utilities_1.FakeRunner();
        const errorCodeForRuleViolations = 2;
        const multilineError = `relevant_out_message
			also_relevant_out_message
		`;
        exec.mockImplementationOnce((_executable, _options, callback) => {
            const err = new Error();
            err.code = errorCodeForRuleViolations;
            err.stdout = multilineError;
            err.stderr = 'err_message';
            callback(err);
        });
        yield __1.default(workspace, runner, { runFixer: true });
        expect(runner.output).toMatch(multilineError);
    }));
});