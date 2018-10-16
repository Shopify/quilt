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
const fs = require("fs-extra");
const path = require("path");
const utilities_1 = require("tests/unit/utilities");
const config_1 = require("../config");
const plugins = require("../../plugins");
const project_1 = require("../project");
const env_1 = require("../../env");
const runner_1 = require("../../runner");
describe('Config', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it('uses default experiments settings', () => {
        const config = new config_1.Config('foo', []);
        expect(config.for('experiments')).toMatchObject(plugins.experiments({}));
    });
    it('accepts experiments overrides', () => {
        const expectedSettings = {
            fastStartup: true
        };
        const config = new config_1.Config('foo', [plugins.experiments(expectedSettings)]);
        expect(config.for('experiments')).toMatchObject(expectedSettings);
    });
    describe('loadConfig', () => {
        afterEach(() => {
            // `loadConfig` uses `require` to read `sewing-kit.config` files.
            // Resetting the registry avoids cached module reads.
            jest.resetModuleRegistry();
        });
        it('looks in config dir for Rails projects', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('config-test-empty-dir', () => __awaiter(this, void 0, void 0, function* () {
                const pathExistsMock = jest.spyOn(fs, 'pathExists');
                yield config_1.default(undefined, new env_1.default(), new project_1.Project(true, { dependencies: {}, devDependencies: {} }, '', false, false, false, false), new runner_1.default());
                expect(pathExistsMock.mock.calls).toEqual([[expect.stringContaining('config/sewing-kit.config.ts')], [expect.stringContaining('config/sewing-kit.config.js')], [expect.stringContaining('sewing-kit.config.ts')], [expect.stringContaining('sewing-kit.config.js')]]);
            }));
        }));
        it('looks in app root for Node projects', () => __awaiter(_this, void 0, void 0, function* () {
            yield utilities_1.withTempDir('config-test-empty-dir', () => __awaiter(this, void 0, void 0, function* () {
                const pathExistsMock = jest.spyOn(fs, 'pathExists');
                yield config_1.default(undefined, new env_1.default(), new project_1.Project(false, { dependencies: {}, devDependencies: {} }, '', false, false, false, false), new runner_1.default());
                expect(pathExistsMock.mock.calls).toEqual([[expect.stringContaining('sewing-kit.config.ts')], [expect.stringContaining('sewing-kit.config.js')]]);
                pathExistsMock.mockReset();
            }));
        }));
    });
    it('reads JavaScript configs', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('ts-config', dir => __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFile(path.join(dir, 'sewing-kit.config.js'), `
          module.exports = function config(env) {
            return {name: 'js-project'}
          }
        `);
            return expect((yield config_1.default(undefined, new env_1.default(), new project_1.Project(false, { dependencies: { typescript: '*' }, devDependencies: {} }, '', false, false, false, false), new utilities_1.FakeRunner()))).toHaveProperty('name', 'js-project');
        }));
    }));
    it('transpiles and reads TypeScript configs', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('ts-config', dir => __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFile(path.join(dir, 'sewing-kit.config.ts'), `
          export default function config(env: any): {name: string} {
            return {name: '🍋'}
          }
        `);
            return expect((yield config_1.default(undefined, new env_1.default(), new project_1.Project(false, { dependencies: { typescript: '*' }, devDependencies: {} }, '', false, false, false, false), new utilities_1.FakeRunner()))).toHaveProperty('name', '🍋');
        }));
    }));
    it('throws if typescript is not a dependency and sewing-kit.config.ts exists', () => __awaiter(_this, void 0, void 0, function* () {
        yield utilities_1.withTempDir('js-config', dir => __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFile(path.join(dir, 'sewing-kit.config.ts'), `module.exports = function() {}`);
            return expect(config_1.default(undefined, new env_1.default(), new project_1.Project(false, { dependencies: {}, devDependencies: {} }, '', false, false, false, false), new utilities_1.FakeRunner())).rejects.toThrow(/sewing-kit needs a TypeScript compiler/);
        }));
    }));
});