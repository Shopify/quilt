"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'check-markdown');
const client = path_1.resolve(fixture, 'client');
const markdown = path_1.resolve(client, 'index.md');
const originalMarkdown = fs_extra_1.readFileSync(markdown);
const markdownFix = path_1.resolve(client, 'index.fix.md');
describe('check', () => {
    afterEach(() => fs_extra_1.writeFileSync(markdown, originalMarkdown));
    it('fails when markdown is not formatted', () => {
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).toThrow();
    });
    it('does not fail when markdown is formatted', () => {
        fs_extra_1.writeFileSync(markdown, fs_extra_1.readFileSync(markdownFix));
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).not.toThrow();
    });
});