import {configure} from 'enzyme';

import Adapter = require('enzyme-adapter-react-16');

configure({adapter: new Adapter()});

if (Intl.PluralRules == null) {
  require('intl-pluralrules');
}

/* eslint-disable no-console */
const originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  // Our decorator test checks that a component throws in some cases,
  // but this leads to very verbose errors in the console. This removes
  // those errors.
  if (
    typeof args[0] === 'string' &&
    /(reportException|error boundary)/.test(args[0])
  ) {
    return;
  }

  originalConsoleError(...args);
};
/* eslint-enable no-console */
