// Cover all standardized ES6 APIs.
require('core-js/es6');
// Standard now
require('core-js/fn/array/includes');
require('core-js/fn/string/pad-start');
require('core-js/fn/string/pad-end');
require('core-js/fn/symbol/async-iterator');
require('core-js/fn/object/get-own-property-descriptors');
require('core-js/fn/object/values');
require('core-js/fn/object/entries');
require('core-js/fn/promise/finally');
// Ensure that we polyfill ES6 compat for anything web-related, if it exists.
require('core-js/web');
require('regenerator-runtime/runtime');
