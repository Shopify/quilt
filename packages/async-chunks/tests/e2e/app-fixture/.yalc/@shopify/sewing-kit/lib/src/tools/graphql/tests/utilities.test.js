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
const graphql_1 = require("graphql");
const utilities_1 = require("../utilities");
jest.mock('fs-extra');
jest.mock('isomorphic-fetch');
jest.mock('is-reachable');
const expectedSchemaObj = {
    data: {
        __schema: {
            queryType: {
                name: 'Query'
            }
        }
    }
};
const schemaJSONStr = JSON.stringify(expectedSchemaObj);
const readFile = require.requireMock('fs-extra').readFile;
const fetch = require.requireMock('isomorphic-fetch');
const isReachable = require.requireMock('is-reachable');
describe('loadSchema()', () => {
    beforeEach(() => {
        readFile.mockClear();
        fetch.mockClear();
        isReachable.mockClear();
    });
    it('reads local schema file when given a local file path', () => __awaiter(_this, void 0, void 0, function* () {
        const localSchemaPath = 'localDirectory/schema.json';
        readFile.mockImplementation(jest.fn().mockReturnValue(schemaJSONStr));
        const results = yield utilities_1.loadSchema(localSchemaPath);
        expect(readFile).toHaveBeenCalledWith(localSchemaPath);
        expect(results).toEqual(expectedSchemaObj);
    }));
    it('fetches schema when given remote endpoint is reachable', () => __awaiter(_this, void 0, void 0, function* () {
        const remoteEndpoint = 'https://api.mock.com';
        isReachable.mockImplementation(() => {
            return true;
        });
        fetch.mockImplementation(() => ({
            text: jest.fn().mockReturnValue(schemaJSONStr)
        }));
        const results = yield utilities_1.loadSchema(remoteEndpoint);
        expect(fetch).toHaveBeenCalledWith(remoteEndpoint);
        expect(results).toEqual(expectedSchemaObj);
    }));
});
describe('getUnionsAndInterfacesFromInstrospection()', () => {
    const schema = graphql_1.buildSchema(`
    interface Named { name: String! }
    type Person implements Named { name: String! }
    type Robot implements Named { name: String! }
    union Self = Robot | Person
    type Query {
      person: Person!
      self: Self!
    }
  `);
    function getSchemaJSON() {
        return graphql_1.graphql(schema, graphql_1.introspectionQuery);
    }
    it('extracts union types', () => __awaiter(_this, void 0, void 0, function* () {
        const schemaJSON = yield getSchemaJSON();
        expect(utilities_1.getUnionsAndInterfacesFromInstrospection(schemaJSON)).toContainEqual({
            kind: 'UNION',
            name: 'Self',
            possibleTypes: [{ name: 'Robot', kind: 'OBJECT' }, { name: 'Person', kind: 'OBJECT' }]
        });
    }));
    it('extracts interface types', () => __awaiter(_this, void 0, void 0, function* () {
        const schemaJSON = yield getSchemaJSON();
        expect(utilities_1.getUnionsAndInterfacesFromInstrospection(schemaJSON)).toContainEqual({
            kind: 'INTERFACE',
            name: 'Named',
            possibleTypes: [{ name: 'Person', kind: 'OBJECT' }, { name: 'Robot', kind: 'OBJECT' }]
        });
    }));
    it('does not extract other types', () => __awaiter(_this, void 0, void 0, function* () {
        const schemaJSON = yield getSchemaJSON();
        const unionsAndInterfaces = utilities_1.getUnionsAndInterfacesFromInstrospection(schemaJSON);
        expect(unionsAndInterfaces).not.toContainEqual({
            name: 'Person'
        });
        expect(unionsAndInterfaces).not.toContainEqual({
            name: 'Robot'
        });
    }));
});