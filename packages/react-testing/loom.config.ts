import {createPackage, createProjectPlugin} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'matchers', root: './src/matchers/index.ts'});
  pkg.use(quiltPackage());
  pkg.use(jestAdjustments());
});

function jestAdjustments() {
  return createProjectPlugin('JestAdjustments', ({tasks: {test}}) => {
    test.hook(({hooks}) => {
      hooks.configure.hook((configuration) => {
        configuration.jestSetupFiles?.hook((files) => [
          ...files,
          './src/tests/setup/environment.ts',
        ]);
      });
    });
  });
}
