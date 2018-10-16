"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'check-scss');
const client = path_1.resolve(fixture, 'client');
const scss = path_1.resolve(client, 'styles.scss');
const originalSCSS = fs_extra_1.readFileSync(scss);
const scssFix = path_1.resolve(client, 'styles.fix.scss');
describe('check', () => {
    afterEach(() => fs_extra_1.writeFileSync(scss, originalSCSS));
    it('fails when scss is not formatted', () => {
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).toThrow();
    });
    it('does not fail when scss is formatted', () => {
        fs_extra_1.writeFileSync(scss, fs_extra_1.readFileSync(scssFix));
        expect(() => child_process_1.execSync(`${utilities_1.sewingKitCLI} check`, { cwd: fixture, stdio: 'ignore' })).not.toThrow();
    });
});