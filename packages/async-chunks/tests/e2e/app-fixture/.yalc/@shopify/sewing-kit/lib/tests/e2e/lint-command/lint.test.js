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
const path_1 = require("path");
const child_process_1 = require("child_process");
const utilities_1 = require("../utilities");
const eslintFixture = path_1.resolve(__dirname, 'fixtures', 'lint');
const showExpectedFixture = path_1.resolve(__dirname, 'fixtures', 'show-expected');
const stylelintErrorFixture = path_1.resolve(__dirname, 'fixtures', 'stylelint-error');
const stylelintMissingConfigFixture = path_1.resolve(__dirname, 'fixtures', 'stylelint-missing-config');
describe('lint', () => {
    it('provides `format` guidance for ESlint errors', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(eslintFixture);
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch(/yarn run sewing-kit format/);
    }), 30000);
    it('uses terminal colours in error output', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(eslintFixture);
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch('\u001b[1');
    }), 20000);
    it('omits expected file contents by default', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(showExpectedFixture);
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch(`client/sample.md`);
        expect(result.stdout).not.toMatch(`- Bullet should be a hyphen`);
    }), 30000);
    it('displays expected file contents for --show-expected', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(showExpectedFixture, {
            '--show-expected': 'true'
        });
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch(`client/sample.md expected:\n- Bullet should be a hyphen`);
    }), 20000);
    it('outputs no stylelint configuration error', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(stylelintMissingConfigFixture);
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch(`To resolve this error you must provide a stylelint configuration. If you wish to use Shopify’s stylelint configuration, add the following to your project’s package.json:`);
    }), 10000);
    it('outputs stylelint errors', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(stylelintErrorFixture, {
            '--show-expected': 'true'
        });
        expect(result.success).toBe(false);
        expect(result.stdout).toMatch(`Unexpected hex color "#abcdef"`);
        expect(result.stdout).not.toMatch(`Command failed`);
    }), 10000);
    it('lints graphql code style in projects with no schema', () => __awaiter(_this, void 0, void 0, function* () {
        const result = yield runTest(path_1.resolve(__dirname, 'fixtures', 'lint-graphql-code-style'), { '--show-expected': 'true' });
        expect(result.success).toBe(false);
        expect(result.stdout).toContain(`> 6 |   bar {`);
    }), 10000);
});
function runTest(cwd, options = {}) {
    const optionsStr = Object.entries(options).reduce((acc, [key, value]) => {
        return `${acc} ${key} '${value}'`;
    }, '');
    return new Promise(resolve => {
        child_process_1.exec(`${utilities_1.sewingKitCLI} lint ${optionsStr}`, { cwd }, (error, stdout) => {
            resolve({
                success: error == null,
                stdout
            });
        });
    });
}