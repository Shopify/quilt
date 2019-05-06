import {readdirSync, readFileSync} from 'fs';
import * as path from 'path';

describe('typescript version', () => {
  it('matches the root version', () => {
    // eslint-disable-next-line typescript/no-var-requires
    const rootPackageJSON = require('../package.json');
    const rootVersion = rootPackageJSON.devDependencies.typescript;

    const packagesPath = path.resolve(__dirname, '..', 'packages');
    const packageNames = readdirSync(packagesPath).filter(
      file => !file.includes('.'),
    );

    for (const packageName of packageNames) {
      const packageJSONPath = path.join(
        packagesPath,
        packageName,
        'package.json',
      );

      const packageJSON = JSON.parse(
        readFileSync(packageJSONPath, {encoding: 'utf8'}),
      );

      expect(packageJSON).toMatchObject({
        devDependencies: {
          typescript: rootVersion,
        },
      });
    }
  });

  it('the version in the plop file matches the root version', () => {
    // eslint-disable-next-line typescript/no-var-requires
    const rootPackageJSON = require('../package.json');
    const rootVersion = rootPackageJSON.devDependencies.typescript;
    // eslint-disable-next-line typescript/no-var-requires
    const plopPackageJSON = require('../templates/package.hbs.json');
    const plopVersion = plopPackageJSON.devDependencies.typescript;

    expect(plopVersion).toBe(rootVersion);
  });
});
