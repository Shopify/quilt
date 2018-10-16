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
const validate_dev_config_task_1 = require("../validate-dev-config-task");
const strings_1 = require("../strings");
describe('validateDevConfig', () => {
    it('only runs once when called multiple times', () => __awaiter(_this, void 0, void 0, function* () {
        const runner = new utilities_1.FakeRunner();
        runner.hasPerformed = jest.fn(() => true);
        yield validate_dev_config_task_1.default(utilities_1.createWorkspace(), runner);
        expect(runner.failed).toBe(false);
        expect(runner.output).toBe('');
    }));
    it('resolves when workspace does not use rails', () => __awaiter(_this, void 0, void 0, function* () {
        const runner = new utilities_1.FakeRunner();
        yield validate_dev_config_task_1.default(utilities_1.createWorkspace({ isRails: false, devYaml: {} }), runner);
        expect(runner.failed).toBe(false);
        expect(runner.output).toBe('');
    }));
    it('resolves when workspace does not use dev', () => __awaiter(_this, void 0, void 0, function* () {
        const runner = new utilities_1.FakeRunner();
        yield validate_dev_config_task_1.default(utilities_1.createWorkspace({ isRails: true, devYaml: false }), runner);
        expect(runner.failed).toBe(false);
        expect(runner.output).toBe('');
    }));
    describe('when workspace uses dev and rails', () => {
        it('fails when dev.yml is configured for vanilla ruby', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({ isRails: true, devYaml: { type: 'ruby' } }), runner);
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(strings_1.VANILLA_RUBY);
        }));
        it('resolves when there is a Procfile.dev', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({
                isRails: true,
                hasProcfile: true
            }), runner);
            expect(runner.failed).toBe(false);
            expect(runner.output).toBe('');
        }));
        it('resolves when devYaml port and railgunYaml port are the same', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({
                devYaml: { server: { port: 3000 } },
                // eslint-disable-next-line camelcase
                railgunYaml: { hostnames: { host: { proxy_to_host_port: 3000 } } }
            }), runner);
            expect(runner.failed).toBe(false);
            expect(runner.output).toBe('');
        }));
        it('fails when devYaml port and railgunYaml port are different', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({
                isRails: true,
                devYaml: { server: { port: 3000 } },
                // eslint-disable-next-line camelcase
                railgunYaml: { hostnames: [{ host: { proxy_to_host_port: 1010 } }] }
            }), runner);
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(strings_1.PORT_MISMATCH);
        }));
        it('fails when devYaml port is missing', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({
                isRails: true,
                devYaml: {},
                // eslint-disable-next-line camelcase
                railgunYaml: { hostnames: [{ host: { proxy_to_host_port: 1010 } }] }
            }), runner);
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(strings_1.PORT_MISMATCH);
        }));
        it('fails when railgunYaml port is missing', () => __awaiter(_this, void 0, void 0, function* () {
            const runner = new utilities_1.FakeRunner();
            yield validate_dev_config_task_1.default(utilities_1.createWorkspace({
                isRails: true,
                devYaml: { server: { port: 3000 } },
                // eslint-disable-next-line camelcase
                railgunYaml: { hostnames: [] }
            }), runner);
            expect(runner.failed).toBe(true);
            expect(runner.output).toMatch(strings_1.PORT_MISMATCH);
        }));
    });
});