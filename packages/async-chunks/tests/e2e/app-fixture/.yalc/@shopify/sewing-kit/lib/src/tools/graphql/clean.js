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
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const utilities_2 = require("./utilities");
const TASK = Symbol('CleanGraphQLSchema');
function cleanGraphQLSchema(workspace, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        const usesGraphQL = Boolean(workspace.config.for('graphql'));
        if (!usesGraphQL || runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        yield Promise.all([fs_extra_1.remove(utilities_1.graphQLSchemaPath(workspace)), fs_extra_1.remove(utilities_2.graphQLUnionAndInterfacesPath(workspace)), fs_extra_1.remove(utilities_1.graphQLSchemaPath(workspace, true))]);
    });
}
exports.default = cleanGraphQLSchema;