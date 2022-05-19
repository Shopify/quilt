import './console-wrapper';
import 'cross-fetch';

// Ensure that ICU data is loaded for tests so that Intl methods respect locale
// and act like they do in the browser
// eslint-disable-next-line no-process-env
process.env.NODE_ICU_DATA = 'node_modules/full-icu';

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}
