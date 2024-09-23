import '../../packages/react-testing/src/matchers';
import '../../packages/graphql-testing/src/matchers';

import {destroyAll} from '../../packages/react-testing/src/destroy';

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await destroyAll();
});
