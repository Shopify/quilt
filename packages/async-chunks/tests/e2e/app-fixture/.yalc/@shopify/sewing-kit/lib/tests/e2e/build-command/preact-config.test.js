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
const puppeteer = require("puppeteer");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("./utilities");
const fixtures = {
    basic: path_1.resolve(__dirname, 'fixtures', 'preact'),
    compat: path_1.resolve(__dirname, 'fixtures', 'preact-compat')
};
describe('preact', () => {
    beforeAll(() => {
        utilities_1.yarnInstall(fixtures.basic);
        utilities_1.yarnInstall(fixtures.compat);
    });
    afterAll(() => {
        fs_extra_1.removeSync(path_1.resolve(fixtures.basic, 'node_modules'));
        fs_extra_1.removeSync(path_1.resolve(fixtures.compat, 'node_modules'));
    });
    describe('preact config', () => {
        const fixture = fixtures.basic;
        const build = path_1.resolve(fixture, 'build');
        const client = path_1.resolve(build, 'client');
        beforeAll(() => utilities_1.runClientBuild(fixture));
        afterAll(() => {
            fs_extra_1.removeSync(client);
            fs_extra_1.removeSync(build);
        });
        it('generates a functioning app', () => __awaiter(_this, void 0, void 0, function* () {
            const server = utilities_1.runFixtureServer(client, 9001);
            const browser = yield puppeteer.launch();
            const page = yield browser.newPage();
            yield page.goto('http://localhost:9001');
            const button = yield page.waitForSelector('#button');
            yield button.tap();
            const clickedMessage = yield page.waitForSelector('#preact-message');
            const text = yield (yield clickedMessage.getProperty('innerHTML')).jsonValue();
            expect(text).toEqual('Preact lives');
            yield browser.close();
            server.close();
        }), 15000);
    });
    describe('preact-compat config', () => {
        const fixture = fixtures.compat;
        const build = path_1.resolve(fixture, 'build');
        const client = path_1.resolve(build, 'client');
        beforeAll(() => utilities_1.runClientBuild(fixture));
        afterAll(() => {
            fs_extra_1.removeSync(client);
            fs_extra_1.removeSync(build);
        });
        it('generates a functioning app', () => __awaiter(_this, void 0, void 0, function* () {
            const server = utilities_1.runFixtureServer(client, 9001);
            const browser = yield puppeteer.launch();
            const page = yield browser.newPage();
            yield page.goto('http://localhost:9001');
            const button = yield page.waitForSelector('#button');
            yield button.tap();
            const clickedMessage = yield page.waitForSelector('#preact-compat-message');
            const text = yield (yield clickedMessage.getProperty('innerHTML')).jsonValue();
            expect(text).toEqual('Preact Compat lives');
            yield browser.close();
            server.close();
        }), 15000);
    });
});