"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Supported algorithms listed in the spec: https://w3c.github.io/webappsec-subresource-integrity/#hash-functions
exports.SRI_HASH_ALGORITHMS = ['sha256', 'sha384', 'sha512'];
function calculateBase64IntegrityFromFilename(path, hashFunction, hashDigest) {
    if (!isHashAlgorithmSupportedByBrowsers(hashFunction)) {
        return false;
    }
    if (hashDigest && hashDigest !== 'hex') {
        return false;
    }
    const chunkInfo =
    // Anything ending in a hyphen + hex string (e.g., `foo-00000000.js`).
    path.match(/.+?-(?:([a-f0-9]+))?\.[^.]+$/) ||
    // Unnamed dynamic imports like `00000000.js`.
    path.match(/^([a-f0-9]+)\.[^.]+$/);
    if (!chunkInfo || !chunkInfo[1]) {
        return false;
    }
    const hexHash = chunkInfo[1];
    const base64Hash = new Buffer(hexHash, 'hex').toString('base64');
    return `${hashFunction}-${base64Hash}`;
}
exports.calculateBase64IntegrityFromFilename = calculateBase64IntegrityFromFilename;
function isHashAlgorithmSupportedByBrowsers(hashFunction) {
    return exports.SRI_HASH_ALGORITHMS.includes(hashFunction);
}