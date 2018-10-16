"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = require("./format");
exports.runPrettierFormat = format_1.runPrettierFormat;
var ignore_init_1 = require("./ignore-init");
exports.init = ignore_init_1.init;
var lint_1 = require("./lint");
exports.runPrettierLint = lint_1.runPrettierLint;
exports.prettierIgnorePaths = ['.*', 'build', 'playground', 'coverage', 'tmp', 'public', 'package.json', '*.svg'];