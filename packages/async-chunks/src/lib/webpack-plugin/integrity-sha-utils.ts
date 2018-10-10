// Supported algorithms listed in the spec: https://w3c.github.io/webappsec-subresource-integrity/#hash-functions
export const SRI_HASH_ALGORITHMS = ['sha256', 'sha384', 'sha512'];

export function calculateBase64IntegrityFromFilename(
  path: string,
  hashFunction: string,
  hashDigest: string,
): string | false {
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

function isHashAlgorithmSupportedByBrowsers(hashFunction: string) {
  return SRI_HASH_ALGORITHMS.includes(hashFunction);
}
