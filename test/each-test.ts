import addClosest from 'element-closest';

import './matchers';
import '../packages/@shopify/ast-utilities/src/matchers';
import '../packages/@shopify/react-testing/src/matchers';
import '../packages/@shopify/graphql-testing/src/matchers';

import {destroyAll} from '../packages/@shopify/react-testing/src/destroy';

if (typeof window !== 'undefined') {
  addClosest(window);
}

afterEach(() => {
  destroyAll();
});
