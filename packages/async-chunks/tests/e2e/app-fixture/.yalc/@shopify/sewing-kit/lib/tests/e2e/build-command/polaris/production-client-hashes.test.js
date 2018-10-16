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
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const e2eBase = path_1.resolve(__dirname, '..');
const baseFixture = path_1.resolve(e2eBase, 'fixtures', 'polaris');
const fixture = path_1.resolve(e2eBase, 'tmp', `polaris-production-client-hashes-${Date.now()}`);
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const assets = path_1.resolve(client, 'assets.json');
describe('polaris', () => {
    beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(fixture);
        yield fs_extra_1.copy(baseFixture, fixture);
        utilities_1.yarnInstall(fixture);
    }), 60000);
    afterEach(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(client);
        yield fs_extra_1.copy(baseFixture, fixture);
    }));
    afterAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(fixture);
    }));
    describe('client', () => {
        describe('production', () => {
            it('does not update the vendor styles when app styles are changed', () => {
                utilities_1.runClientBuild(fixture);
                const originalAssets = fs_extra_1.readJsonSync(assets).assets;
                const appStyles = path_1.resolve(fixture, 'client', 'index.scss');
                fs_extra_1.writeFileSync(appStyles, `.ShouldBeMinified { color: green; }`);
                utilities_1.runClientBuild(fixture);
                const updatedAssets = fs_extra_1.readJsonSync(assets).assets;
                expect(originalAssets.main.css).not.toBe(updatedAssets.main.css);
                expect(originalAssets['vendors~main'].css).toBe(updatedAssets['vendors~main'].css);
            });
        });
    });
});