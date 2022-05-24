import './console-wrapper';
import 'whatwg-fetch';

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}
