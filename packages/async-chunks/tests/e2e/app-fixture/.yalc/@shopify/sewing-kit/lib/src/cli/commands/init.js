"use strict";

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
const env_1 = require("../../env");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const prettier_1 = require("../../tools/prettier");
const common_1 = require("./common");
exports.command = 'init';
exports.desc = 'creates config files for tools';
exports.builder = Object.assign({ prettierignore: {
        boolean: true,
        default: undefined
    } }, common_1.options);
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(argv.logLevel));
        const workspace = yield workspace_1.default(new env_1.default(), runner, argv);
        const { prettierignore } = argv;
        if (prettierignore) {
            prettier_1.init(workspace, runner);
        }
    });
}
exports.handler = handler;