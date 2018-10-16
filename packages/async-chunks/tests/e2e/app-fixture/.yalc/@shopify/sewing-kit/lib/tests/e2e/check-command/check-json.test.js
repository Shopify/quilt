"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'check-json');
const client = path_1.resolve(fixture, 'client');
const json = path_1.resolve(client, 'index.json');
const originalJSON = fs_extra_1.readFileSync(json);
const jsonFix = path_1.resolve(client, 'index.fix.json');
describe('check', () => {
    afterEach(() => fs_extra_1.writeFileSync(json, originalJSON));
    it('fails when json is not formatted', () => {
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).toThrow();
    });
    it('does not fail when json is formatted', () => {
        fs_extra_1.writeFileSync(json, fs_extra_1.readFileSync(jsonFix));
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).not.toThrow();
    });
});