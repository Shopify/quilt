// general logic and approach taken from
// https://github.com/matthew-andrews/isomorphic-fetch/blob/master/fetch-npm-node.js

// eslint-disable-next-line typescript/no-var-requires
const nodeFetch = require('node-fetch');

function wrappedFetch(url: string | Request, options) {
  if (typeof url !== 'string') {
    return nodeFetch.call(this, url, options);
  }

  const finalURL = /^\/\//.test(url) ? `https:${url}` : url;
  return nodeFetch.call(this, finalURL, options);
}

if (!(global as any).fetch) {
  (global as any).fetch = wrappedFetch;
  (global as any).Response = nodeFetch.Response;
  (global as any).Headers = nodeFetch.Headers;
  (global as any).Request = nodeFetch.Request;
}

export {};
