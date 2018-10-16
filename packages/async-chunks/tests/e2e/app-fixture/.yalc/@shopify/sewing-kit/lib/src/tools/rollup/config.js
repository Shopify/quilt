"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const json = require("rollup-plugin-json");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
function createInputConfig({ config }) {
    const defaultConfig = {
        input: 'src/index.js',
        plugins: [json(), nodeResolve({
            module: true,
            jsnext: true,
            main: true
        }), commonjs(), babel({
            include: '**/*.js',
            exclude: 'node_modules/**',
            runtimeHelpers: true
        })]
    };
    const rollupConfig = config.for('rollup');
    if (rollupConfig && rollupConfig.configure && rollupConfig.configure.input) {
        return rollupConfig.configure.input(defaultConfig);
    } else {
        return defaultConfig;
    }
}
exports.createInputConfig = createInputConfig;
function createOutputConfig({ config }) {
    const defaultConfig = {
        file: 'dist/index.js',
        format: 'umd'
    };
    const rollupConfig = config.for('rollup');
    if (rollupConfig && rollupConfig.configure && rollupConfig.configure.output) {
        return rollupConfig.configure.output(defaultConfig);
    } else {
        return defaultConfig;
    }
}
exports.createOutputConfig = createOutputConfig;