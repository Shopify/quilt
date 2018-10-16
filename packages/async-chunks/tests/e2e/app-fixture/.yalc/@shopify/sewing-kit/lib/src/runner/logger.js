"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
/* eslint-disable shopify/typescript/prefer-pascal-case-enums */
// Lower-cased names is a lazy way to accept `--log-level <level>` without
// explicitly validating/converting inputs.
var Verbosity;
(function (Verbosity) {
    Verbosity["debug"] = "debug";
    Verbosity["info"] = "info";
    Verbosity["warn"] = "warn";
    Verbosity["error"] = "error";
})(Verbosity = exports.Verbosity || (exports.Verbosity = {}));
class Logger {
    constructor(verbosity = Verbosity.info) {
        this.verbosity = verbosity;
    }
    error(error) {
        const { message, stack } = error;
        this.log(colors => `${colors.bold.red('[error]')} ${message}`, {
            verbosity: Verbosity.error,
            method: 'error'
        });
        if (stack) {
            this.log(colors => colors.dim(stack), {
                verbosity: Verbosity.debug,
                method: 'log'
            });
        }
    }
    info(message) {
        this.log(message, {
            verbosity: Verbosity.info,
            method: 'log'
        });
    }
    warn(message) {
        this.log(message, {
            verbosity: Verbosity.warn,
            method: 'warn'
        });
    }
    debug(message) {
        this.log(message, {
            verbosity: Verbosity.debug,
            method: 'log'
        });
    }
    log(message, { verbosity, method = 'log' }) {
        const messageLevel = Object.keys(Verbosity).findIndex(enumKey => enumKey === verbosity);
        const loggerLevel = Object.keys(Verbosity).findIndex(enumKey => enumKey === this.verbosity);
        if (messageLevel < loggerLevel) {
            return;
        }
        // eslint-disable-next-line no-console
        console[method](messageString(message));
    }
}
exports.default = Logger;
function messageString(message) {
    return typeof message === 'function' ? message(chalk) : message;
}