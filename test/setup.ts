import './console-wrapper';
import 'isomorphic-fetch';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './matchers';

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}

Enzyme.configure({adapter: new Adapter()});
