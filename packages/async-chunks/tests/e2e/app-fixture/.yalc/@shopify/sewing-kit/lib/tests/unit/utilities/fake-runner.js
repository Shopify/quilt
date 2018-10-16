"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const runner_1 = require("../../../src/runner");
class FakeLogger extends runner_1.Logger {
    constructor(enableDebug = true) {
        super();
        this.enableDebug = enableDebug;
        this._output = [];
    }
    error(error) {
        this._output.push(error.message);
    }
    info(message) {
        this._output.push(typeof message === 'function' ? message(chalk_1.default) : message);
    }
    warn(message) {
        this._output.push(typeof message === 'function' ? message(chalk_1.default) : message);
    }
    debug(message) {
        if (this.enableDebug) {
            this._output.push(typeof message === 'function' ? message(chalk_1.default) : message);
        }
    }
    get output() {
        return this._output.join('\n');
    }
}
class FakeRunner extends runner_1.default {
    constructor(enableDebug) {
        super(new FakeLogger(enableDebug));
        this._ended = false;
        this._failed = false;
    }
    get output() {
        return this.logger.output;
    }
    get ended() {
        return this._ended;
    }
    get failed() {
        return this._failed;
    }
    setEnded() {
        this._ended = true;
    }
    setFailed() {
        this._failed = true;
    }
}
exports.FakeRunner = FakeRunner;
FakeRunner.prototype.fail = FakeRunner.prototype.setFailed;
FakeRunner.prototype.end = FakeRunner.prototype.setEnded;