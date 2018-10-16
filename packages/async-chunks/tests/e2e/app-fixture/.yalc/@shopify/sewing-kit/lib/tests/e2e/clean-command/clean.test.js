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
const globCallback = require("glob");
const path_1 = require("path");
const util_1 = require("util");
const utilities_1 = require("tests/unit/utilities");
const utilities_2 = require("../utilities");
const glob = util_1.promisify(globCallback);
describe('clean', () => {
    it('does not clean vendor dll files by default', utilities_1.withTempFixture(path_1.resolve(__dirname, 'fixtures', 'vendor-dll'), dir => __awaiter(_this, void 0, void 0, function* () {
        yield runDevelopmentEnvironment();
        expect((yield glob(`${dir}/build/cache/dll/*`))).toEqual(expect.arrayContaining([expect.stringMatching(/\/vendor.js$/), expect.stringMatching(/\/vendor.json$/)]));
        yield runClean();
        expect(fs_extra_1.existsSync(path_1.resolve(dir, 'build', 'cache', 'dll'))).toBe(true);
    })), 60000);
    it('cleans vendor dll files when requested', utilities_1.withTempFixture(path_1.resolve(__dirname, 'fixtures', 'vendor-dll'), dir => __awaiter(_this, void 0, void 0, function* () {
        yield runDevelopmentEnvironment();
        expect((yield glob(`${dir}/build/cache/dll/*`))).toEqual(expect.arrayContaining([expect.stringMatching(/\/vendor.js$/), expect.stringMatching(/\/vendor.json$/)]));
        yield runClean('--vendor-dll');
        expect(fs_extra_1.existsSync(path_1.resolve(dir, 'build', 'cache'))).toBe(true);
        expect(fs_extra_1.existsSync(path_1.resolve(dir, 'build', 'cache', 'dll'))).toBe(false);
    })), 60000);
});
function runDevelopmentEnvironment() {
    return new Promise((resolve, reject) => {
        let success = false;
        const child = child_process_1.exec(`${utilities_2.sewingKitCLI} dev`);
        child.on('exit', () => {
            if (success) {
                resolve();
            } else {
                reject();
            }
        });
        child.stdout.on('data', data => {
            const killId = process.env.CI ? child.pid + 1 : child.pid;
            if (data.toString().includes('Running with latest changes')) {
                success = true;
                child_process_1.execSync(`kill -15 ${killId}`);
            } else if (data.toString().includes('Error:')) {
                child_process_1.execSync(`kill -15 ${killId}`);
            }
        });
    });
}
function runClean(options = '') {
    child_process_1.execSync(`${utilities_2.sewingKitCLI} clean ${options}`);
}