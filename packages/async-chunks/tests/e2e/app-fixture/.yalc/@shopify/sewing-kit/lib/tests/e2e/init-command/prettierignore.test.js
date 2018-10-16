"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const utilities_1 = require("../utilities");
const prettier_1 = require("../../../src/tools/prettier");
const prettier = path_1.resolve(__dirname, 'fixtures', 'prettier');
describe('init', () => {
    describe('intializes .prettierignore file', () => {
        afterEach(() => fs_extra_1.removeSync(path_1.resolve(prettier, '.prettierignore')));
        it('should create a .prettierignore', () => {
            child_process_1.execSync(`${utilities_1.sewingKitCLI} init --prettierignore`, {
                cwd: prettier,
                stdio: 'inherit'
            });
            const prettierIgnore = path_1.resolve(prettier, '.prettierignore');
            expect(fs_extra_1.existsSync(prettierIgnore)).toBe(true);
        });
        it('should match the test fixture’s .prettierconfig', () => {
            child_process_1.execSync(`${utilities_1.sewingKitCLI} init --prettierignore`, {
                cwd: prettier,
                stdio: 'inherit'
            });
            const prettierIgnore = path_1.resolve(prettier, '.prettierignore');
            expect(fs_extra_1.readFileSync(prettierIgnore, 'utf8')).toMatch(prettier_1.prettierIgnorePaths.join('\n'));
        });
    });
});