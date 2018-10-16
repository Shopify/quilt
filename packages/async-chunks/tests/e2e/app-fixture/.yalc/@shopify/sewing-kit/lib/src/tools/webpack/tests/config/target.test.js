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
const utilities_1 = require("tests/unit/utilities");
const env_1 = require("../../../../env");
const config_1 = require("../../config");
const server = new env_1.default({ target: 'server' });
const client = new env_1.default({ target: 'client' });
describe('webpackConfig()', () => {
    describe('target', () => {
        it('uses the `web` target for the `client` environment', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({ env: client })))).toHaveProperty('target', 'web');
        }));
        it('uses the `node` target for the `server` environment', () => __awaiter(_this, void 0, void 0, function* () {
            expect((yield config_1.default(utilities_1.createWorkspace({ env: server })))).toHaveProperty('target', 'node');
        }));
    });
});