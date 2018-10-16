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
const fixture = path_1.resolve(e2eBase, 'tmp', `polaris-server-${Date.now()}`);
const build = path_1.resolve(fixture, 'build');
const client = path_1.resolve(build, 'client');
const server = path_1.resolve(build, 'server');
describe('polaris', () => {
    beforeAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.mkdirp(fixture);
        yield fs_extra_1.copy(baseFixture, fixture);
        utilities_1.yarnInstall(fixture);
    }), 60000);
    afterEach(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(client);
        yield fs_extra_1.remove(server);
        yield fs_extra_1.copy(baseFixture, fixture);
    }));
    afterAll(() => __awaiter(_this, void 0, void 0, function* () {
        yield fs_extra_1.remove(fixture);
    }));
    describe('server', () => {
        describe('development', () => {
            it('references the default version of Polaris', () => {
                utilities_1.runServerBuild(fixture, { '--mode': 'development' });
                const content = fs_extra_1.readFileSync(path_1.resolve(server, 'main.js'), 'utf8');
                expect(content).toMatch('require("@shopify/polaris")');
            });
        });
        describe('production', () => {
            it('builds Polaris from source', () => {
                utilities_1.runServerBuild(fixture);
                const content = fs_extra_1.readFileSync(path_1.resolve(server, 'main.js'), 'utf8');
                expect(content).toMatch('webpack_require__("./node_modules/@shopify/polaris/esnext/components/Avatar/index.js");');
                expect(content).not.toMatch('require("@shopify/polaris")');
            });
        });
    });
});