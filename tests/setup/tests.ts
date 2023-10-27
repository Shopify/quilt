import {toBeObject, toBeOneOf} from 'jest-extended';

import '../matchers';
import '../../packages/react-testing/src/matchers/all';
import '../../packages/graphql-testing/src/matchers/all';

import {destroyAll} from '../../packages/react-testing/src/destroy';

expect.extend({toBeObject, toBeOneOf});

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await destroyAll();
});
