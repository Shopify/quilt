"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function ifElse(condition, then, otherwise) {
    return condition ? then : otherwise;
}
exports.ifElse = ifElse;
function flatten(array) {
    return array.reduce((all, item) => {
        if (!item) {
            return all;
        }
        return Array.isArray(item) ? [...all, ...flatten(item)] : [...all, item];
    }, []);
}
exports.flatten = flatten;
function removeEmptyValues(obj) {
    return Object.keys(obj).reduce((all, key) => {
        const value = obj[key];
        if (value == null || Array.isArray(value) && value.length === 0) {
            return all;
        }
        return Object.assign({}, all, { [key]: value });
    }, {});
}
exports.removeEmptyValues = removeEmptyValues;
function removeEmptyStringValues(obj) {
    return Object.keys(obj).reduce((all, key) => {
        const value = obj[key];
        if (value == null || Array.isArray(value) && value.length === 0) {
            return all;
        }
        return Object.assign({}, all, { [key]: value });
    }, {});
}
exports.removeEmptyStringValues = removeEmptyStringValues;
function msToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 1000 / 60);
    let seconds = Math.round(ms / 1000 % 60);
    if (seconds === 60) {
        minutes += 1;
        seconds = 0;
    }
    if (minutes === 0) {
        return `${seconds}s`;
    }
    if (seconds < 10) {
        return `${minutes}m0${seconds}s`;
    }
    return `${minutes}m${seconds}s`;
}
exports.msToMinutesAndSeconds = msToMinutesAndSeconds;