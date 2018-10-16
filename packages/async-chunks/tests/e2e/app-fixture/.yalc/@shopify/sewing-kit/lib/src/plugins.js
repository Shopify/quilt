"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function cdn(url) {
    return { plugin: 'cdn', url };
}
exports.cdn = cdn;
function entry(entries) {
    return { plugin: 'entry', entries };
}
exports.entry = entry;
function experiments({ fastStartup = false, optimizeLodash = false, railsWithNodeServer = false, asyncChunks = false }) {
    return {
        plugin: 'experiments',
        fastStartup,
        optimizeLodash,
        asyncChunks,
        railsWithNodeServer
    };
}
exports.experiments = experiments;
function externals(externals) {
    return { plugin: 'externals', externals };
}
exports.externals = externals;
function graphql({ schema }) {
    return {
        plugin: 'graphql',
        schema: typeof schema === 'string' ? { production: schema } : schema
    };
}
exports.graphql = graphql;
function jest(configure) {
    return { plugin: 'jest', configure };
}
exports.jest = jest;
function manifest(filename) {
    return { plugin: 'manifest', filename };
}
exports.manifest = manifest;
function paths(paths) {
    return {
        plugin: 'paths',
        paths
    };
}
exports.paths = paths;
function sass({ autoInclude = [], autoImportPolaris = true }) {
    return { plugin: 'sass', autoInclude, autoImportPolaris };
}
exports.sass = sass;
function webpack(configure) {
    return { plugin: 'webpack', configure };
}
exports.webpack = webpack;
function vendors(modules) {
    return { plugin: 'vendors', modules };
}
exports.vendors = vendors;
function devServer(options) {
    return Object.assign({ plugin: 'devServer' }, options);
}
exports.devServer = devServer;
function rollup(configure) {
    return {
        plugin: 'rollup',
        configure
    };
}
exports.rollup = rollup;