import {resolve} from 'path';

import {readJSONSync} from 'fs-extra';
import glob from 'glob';

const IGNORE_REGEX = [/tsconfig\.json/, /tsconfig_base\.json/];

const ROOT = resolve(__dirname, '..');
const projectReferencesConfig = resolve(ROOT, 'packages', 'tsconfig.json');

describe('typescript project references', () => {
  it('includes all the packages', () => {
    const referencesConfig = readJSONSync(projectReferencesConfig);
    const references = referencesConfig.references.map(({path}) =>
      path.replace('./', ''),
    );

    const packages = glob
      .sync(resolve(ROOT, 'packages', '*/package.json'))
      .filter(filePath => !IGNORE_REGEX.some(regex => regex.test(filePath)))
      .map(
        packageJsonPath =>
          /quilt\/packages\/(?<packageName>[\w._-]+)\/package\.json$/i.exec(
            packageJsonPath,
          ).groups.packageName,
      );

    expect(packages.sort()).toStrictEqual(references.sort());
  });
});
