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
describe('mode', () => {
    it('uses development for development targets', () => __awaiter(_this, void 0, void 0, function* () {
        expect((yield config_1.default(utilities_1.createWorkspace({
            env: new env_1.default({ mode: 'development', target: 'client' })
        })))).toHaveProperty('mode', 'development');
        expect((yield config_1.default(utilities_1.createWorkspace({
            env: new env_1.default({ mode: 'development', target: 'server' })
        })))).toHaveProperty('mode', 'development');
    }));
    it('keeps test builds fast with development mode', () => __awaiter(_this, void 0, void 0, function* () {
        expect((yield config_1.default(utilities_1.createWorkspace({
            env: new env_1.default({ mode: 'test', target: 'client' })
        })))).toHaveProperty('mode', 'development');
        expect((yield config_1.default(utilities_1.createWorkspace({
            env: new env_1.default({ mode: 'test', target: 'server' })
        })))).toHaveProperty('mode', 'development');
    }));
    it.each([[new env_1.default({ mode: 'production', target: 'client' })], [new env_1.default({ mode: 'production', target: 'server' })], [new env_1.default({ mode: 'staging', target: 'client' })], [new env_1.default({ mode: 'staging', target: 'server' })]])('uses webpack production mode for optimized %s assets', env => __awaiter(_this, void 0, void 0, function* () {
        expect((yield config_1.default(utilities_1.createWorkspace({
            env
        })))).toHaveProperty('mode', 'production');
    }));
});