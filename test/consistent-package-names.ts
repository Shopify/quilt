import {readdirSync, readFileSync, existsSync} from 'fs';
import path from 'path';

describe('package name', () => {
  it('matches the path name', () => {
    const packagesPath = path.resolve(__dirname, '..', 'packages');
    const packageNames = readdirSync(packagesPath);

    for (const packageName of packageNames) {
      const packageJSONPath = path.join(
        packagesPath,
        packageName,
        'package.json',
      );

      if (!existsSync(packageJSONPath)) {
        continue;
      }

      const packageJSON = JSON.parse(
        readFileSync(packageJSONPath, {encoding: 'utf8'}),
      );

      expect(packageJSON.name).toBe(packageName);
    }
  });
});
