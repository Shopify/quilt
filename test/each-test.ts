import addClosest from 'element-closest';

import './matchers';
import '../packages/ast-utilities/src/matchers';
import '../packages/react-testing/src/matchers';
import '../packages/graphql-testing/src/matchers';

import {destroyAll} from '../packages/react-testing/src/destroy';

if (typeof window !== 'undefined') {
  addClosest(window);
}

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => {
  destroyAll();
});
