"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("../../runner");
exports.options = {
    config: {
        string: true,
        normalize: true
    },
    'log-level': {
        string: true,
        choices: Object.values(runner_1.Verbosity),
        default: 'info'
    }
};