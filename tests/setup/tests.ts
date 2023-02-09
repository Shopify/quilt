import {toBeObject, toBeOneOf} from 'jest-extended';

import '../matchers';
import '../../packages/ast-utilities/src/matchers';
import '../../packages/react-testing/src/matchers';
import '../../packages/graphql-testing/src/matchers';

import {destroyAll} from '../../packages/react-testing/src/destroy';

expect.extend({toBeObject, toBeOneOf});

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await destroyAll();
});
