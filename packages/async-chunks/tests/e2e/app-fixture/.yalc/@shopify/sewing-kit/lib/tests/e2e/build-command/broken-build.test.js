"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'broken-build');
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
describe('broken build', () => {
    afterAll(() => {
        fs_extra_1.removeSync(build);
    });
    afterEach(() => {
        fs_extra_1.removeSync(client);
    });
    it('throws on compiler warnings', () => {
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} build --client-only}`, {
            cwd: fixture,
            stdio: 'ignore'
        })).toThrow();
    });
});