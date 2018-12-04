"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var caniuse_api_1 = require("caniuse-api");
exports.polyfills = {
    baseline: {
        supportsNode: true,
    },
    fetch: {
        supportsNode: true,
        featureTest: 'fetch',
    },
    intl: {
        supportsNode: false,
        featureTest: 'internationalization-plural-rul',
    },
    url: {
        supportsNode: true,
        featureTest: 'urlsearchparams',
    },
};
function mappedPolyfillsForEnv(browser) {
    var mappedPolyfills = {};
    Object.entries(exports.polyfills).forEach(function (_a) {
        var _b = __read(_a, 2), polyfill = _b[0], _c = _b[1], supportsNode = _c.supportsNode, featureTest = _c.featureTest;
        var mapFrom = "@shopify/polyfills/" + polyfill + "$";
        var mapToPrefix = "shopify-polyfills-beta";
        var noop = "shopify-polyfills-beta/noop";
        if (browser === 'node') {
            mappedPolyfills[mapFrom] = supportsNode
                ? mapToPrefix + "/" + polyfill + ".node"
                : noop;
        }
        else if (featureTest) {
            mappedPolyfills[mapFrom] = caniuse_api_1.isSupported(featureTest, browser)
                ? noop
                : mapToPrefix + "/" + polyfill;
        }
        else {
            // If there's no feature we can test for, we assume we always need to polyfill it.
            mappedPolyfills[mapFrom] = mapToPrefix + "/" + polyfill;
        }
    });
    return mappedPolyfills;
}
exports.mappedPolyfillsForEnv = mappedPolyfillsForEnv;
