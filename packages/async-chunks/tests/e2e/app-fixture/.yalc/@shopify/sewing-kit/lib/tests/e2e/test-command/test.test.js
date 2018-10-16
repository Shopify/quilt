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
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const utilities_1 = require("../utilities");
const fixtureRoot = path_1.resolve(__dirname, 'fixtures');
describe('tests', () => {
    it('passes when tests pass', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTests('tests-all-passes');
        expect(result).toHaveProperty('success', true);
        expect(result.stderr).toMatch(/PASS.*?passes\.test\.js/);
    }), 30000);
    it('fails when tests fail', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTests('tests-all-fails');
        expect(result).toHaveProperty('success', false);
        expect(result.stderr).toMatch(/FAIL.*?fails\.test\.js/);
    }), 20000);
    it('runs multiple tests', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTests('tests-mixed-results');
        expect(result).toHaveProperty('success', false);
        expect(result.stderr).toMatch(/PASS.*?passes\.test\.js/);
        expect(result.stderr).toMatch(/FAIL.*?fails\.test\.js/);
    }), 20000);
    describe('update-snapshot', () => {
        const app = path_1.resolve(fixtureRoot, 'tests-update-snapshot', 'app');
        const testJSPath = path_1.resolve(app, 'snapshot.test.js');
        let originalTestJS;
        beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
            originalTestJS = yield fs_extra_1.readFile(testJSPath, 'utf-8');
        }));
        afterEach(() => __awaiter(_this, void 0, void 0, function* () {
            yield fs_extra_1.remove(path_1.resolve(app, '__snapshots__'));
            yield fs_extra_1.writeFile(testJSPath, originalTestJS);
        }));
        it('fails changed tests if update-snapshot is not requested', () => __awaiter(_this, void 0, void 0, function* () {
            const firstResult = yield runTests('tests-update-snapshot', '--update-snapshot');
            expect(firstResult).toHaveProperty('success', true);
            yield fs_extra_1.writeFile(testJSPath, originalTestJS.replace('foo', 'bar'));
            const result = yield runTests('tests-update-snapshot');
            expect(result).toHaveProperty('success', false);
            expect(result.stderr).toMatch(/Received value does not match stored snapshot/);
        }), 20000);
        it('updates snapshot when requested', () => __awaiter(_this, void 0, void 0, function* () {
            const firstResult = yield runTests('tests-update-snapshot', '--update-snapshot');
            expect(firstResult).toHaveProperty('success', true);
            yield fs_extra_1.writeFile(testJSPath, originalTestJS.replace('foo', 'bar'));
            const result = yield runTests('tests-update-snapshot', '--updateSnapshot');
            expect(result).toHaveProperty('success', true);
            expect(result.stderr).toMatch(/1 snapshot updated/);
        }), 20000);
    });
    describe('testRegex', () => {
        it('restricts running tests to those matching the regex', () => __awaiter(_this, void 0, void 0, function* () {
            const result = yield runTests('tests-mixed-results', "'passes.test.js'");
            expect(result).toHaveProperty('success', true);
            expect(result.stderr).toMatch(/PASS.*?passes\.test\.js/);
            expect(result.stderr).not.toMatch(/fails\.test\.js/);
        }), 10000);
    });
});
function runTests(fixtureDirectory, cliArguments = '') {
    const fixturePath = path_1.resolve(fixtureRoot, fixtureDirectory);
    const jestEnv = Object.assign({}, process.env, { CI: true });
    return new Promise(resolve => {
        child_process_1.exec(`${utilities_1.sewingKitCLI} test ${cliArguments} --no-watch`, { cwd: fixturePath, env: jestEnv }, (error, stdout, stderr) => {
            resolve({
                error,
                stdout,
                stderr,
                success: error == null
            });
        });
    });
}