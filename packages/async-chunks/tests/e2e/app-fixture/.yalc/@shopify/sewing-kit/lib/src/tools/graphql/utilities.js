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
const path_1 = require("path");
const isReachable = require('is-reachable');
const fetch = require('isomorphic-fetch');
const { readFile } = require('fs-extra');
function loadSchema(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (endpoint.match(/https?/i)) {
            if (!(yield isReachable(endpoint))) {
                throw new Error(`Attempted to fetch the GraphQL schema from '${endpoint}', but it was not reachable.`);
            }
            const response = yield fetch(endpoint);
            return JSON.parse((yield response.text()));
        }
        const response = yield getFile(endpoint);
        return JSON.parse((yield response));
    });
}
exports.loadSchema = loadSchema;
function loadProductionSchema(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (endpoint.match(/https?/i)) {
            const response = yield fetch(endpoint);
            return JSON.parse((yield response.text()));
        }
        const response = yield getFile(endpoint);
        return JSON.parse((yield response));
    });
}
exports.loadProductionSchema = loadProductionSchema;
function getFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield readFile(path);
            return content.toString();
        } catch (error) {
            throw new Error(`Attempted to fetch the GraphQL schema from '${path}', but file was not readable.`);
        }
    });
}
function getUnionsAndInterfacesFromInstrospection(introspection) {
    return introspection.data.__schema.types.filter(type => type.possibleTypes != null).map(type => ({
        kind: type.kind,
        name: type.name,
        possibleTypes: type.possibleTypes.map(({ kind, name }) => ({ kind, name }))
    }));
}
exports.getUnionsAndInterfacesFromInstrospection = getUnionsAndInterfacesFromInstrospection;
function graphQLUnionAndInterfacesPath(workspace) {
    return path_1.join(workspace.paths.build, 'schema-unions-and-interfaces.json');
}
exports.graphQLUnionAndInterfacesPath = graphQLUnionAndInterfacesPath;