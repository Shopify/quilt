"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const URL = require("url");
const _formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const utilities_1 = require("../../utilities");
function getHMRPath(publicPath) {
    let relativePath;
    if (publicPath.match(/^https?:\/\//)) {
        relativePath = URL.parse(publicPath).pathname || '/';
    } else if (publicPath.match(/^\/\//)) {
        relativePath = URL.parse(URL.resolve('http:', publicPath)).pathname || '/';
    } else {
        relativePath = publicPath;
    }
    return relativePath;
}
exports.getHMRPath = getHMRPath;
function addHMRConfig({ project }, config) {
    const hotPath = URL.resolve(config.output.publicPath, '__webpack_hmr');
    config.entry = prependToEntries(config.entry, `webpack-hot-middleware/client?path=${hotPath}&reload=true&overlay=false`);
    if (project.usesReact) {
        config.entry = prependToEntries(config.entry, 'react-hot-loader/patch');
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
}
exports.addHMRConfig = addHMRConfig;
function prependToEntries(entry, entryModule) {
    if (typeof entry === 'string' || Array.isArray(entry)) {
        return addModuleToEntryList(entryModule, entry);
    } else {
        return Object.keys(entry).reduce((allEntries, key) => Object.assign({}, allEntries, { [key]: key === 'bugsnag' ? entry[key] : addModuleToEntryList(entryModule, entry[key]) }), {});
    }
}
exports.prependToEntries = prependToEntries;
function addModuleToEntryList(moduleToAdd, entry) {
    if (typeof entry === 'string') {
        return [moduleToAdd, entry];
    } else {
        return entry.includes(moduleToAdd) ? entry : [moduleToAdd, ...entry];
    }
}
function addVendorToEntries(entries, vendor) {
    if (typeof entries === 'string' || Array.isArray(entries)) {
        return { main: entries, vendor };
    }
    if (entries.vendor || entries.vendors) {
        throw new Error('Please add vendor libraries via plugins.vendors');
    }
    return Object.assign({}, entries, { vendor });
}
exports.addVendorToEntries = addVendorToEntries;
function formatWebpackMessages(stats, loggedStats) {
    const statsObject = stats.toJson({ warnings: true, errors: true });
    const newMessages = _formatWebpackMessages(statsObject);
    const loggedMessages = loggedStats ? _formatWebpackMessages(loggedStats.toJson({ warnings: true, errors: true })) : { errors: [], warnings: [] };
    // This allows us to dedupe errors that are shown for both the client and server
    // bundles.
    const finalMessages = {
        errors: [],
        warnings: []
    };
    ['warnings', 'errors'].forEach(messageType => {
        const loggedMessagesOfType = loggedMessages[messageType];
        finalMessages[messageType] = loggedMessagesOfType.length ? newMessages[messageType].filter(message => !loggedMessagesOfType.includes(message)) : newMessages[messageType];
    });
    return finalMessages;
}
exports.formatWebpackMessages = formatWebpackMessages;
function compileTime(stats) {
    return utilities_1.msToMinutesAndSeconds(stats.endTime - stats.startTime);
}
exports.compileTime = compileTime;
function logStats({ logger }, stats, { name, onlyErrors, matchingStats }) {
    const finalMessages = formatWebpackMessages(stats, matchingStats);
    if (finalMessages.errors.length) {
        finalMessages.errors.forEach(error => {
            logger.warn(`${error}\n`);
        });
    }
    if (finalMessages.warnings.length) {
        finalMessages.warnings.forEach(warning => {
            logger.warn(`${warning}\n`);
        });
    }
    if (stats.hasErrors()) {
        logger.warn(chalk => `${chalk.bold(`[${name}]`)} Build failed.${finalMessages.errors.length ? '' : ' See errors noted above.'}`);
    } else if (stats.hasWarnings()) {
        logger.warn(chalk => `${chalk.bold(`[${name}]`)} Build had warnings.${finalMessages.warnings.length ? '' : ' See warnings noted above.'}`);
    } else if (!onlyErrors) {
        logger.info(chalk => `${chalk.bold(`[${name}]`)} Compiled with latest changes (${compileTime(stats)})`);
    }
}
exports.logStats = logStats;