import './console-wrapper';
import 'cross-fetch';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}

Enzyme.configure({adapter: new Adapter()});
