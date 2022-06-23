import './console-wrapper';
import 'cross-fetch';

import {TextEncoder, TextDecoder} from 'util';
// our node-fetch polyfill is old, this isn't supported until whatwg-url is ^10.0.0
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}
