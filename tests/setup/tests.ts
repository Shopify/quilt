import addClosest from 'element-closest';
import {toBeObject, toBeOneOf} from 'jest-extended';

import 'saddle-up/matchers';
import 'saddle-up/koa-matchers';
import '../matchers';
import '../../packages/ast-utilities/src/matchers';
import '../../packages/react-testing/src/matchers';
import '../../packages/graphql-testing/src/matchers';

import {destroyAll} from '../../packages/react-testing/src/destroy';

// expect.extend(matchers);
expect.extend({toBeObject, toBeOneOf});

if (typeof window !== 'undefined') {
  addClosest(window);
}

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => {
  destroyAll();
});
