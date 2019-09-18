import {execSync} from 'child_process';
import {resolve, join} from 'path';
import {readFileSync, writeFileSync} from 'fs-extra';
import glob from 'glob';
import {
  transform,
  addReleaseToChangelog,
} from '../packages/ast-utilities/markdown.js';

interface PackageMetadata {
  package: string;
  version: string;
  changelogPath: string;
}

const root = resolve(__dirname, '..');
const packagesDir = join(root, 'packages');

const tagsOnHead = execSync('git --no-pager tag --contains e0d0d3ba', {
  encoding: 'utf8',
}).trim();
const taggedPackagesMetadata: PackageMetadata[] = tagsOnHead
  .split('\n')
  .slice(0, 5)
  .map(line => {
    const [, packageName, version] = line.split('@');

    const folder = packageName && packageName.split('/')[1];
    const changelogPath = glob.sync(
      join(packagesDir, folder, 'CHANGELOG.md'),
    )[0];

    return {
      package: `@${packageName}`,
      version,
      changelogPath,
    };
  });

taggedPackagesMetadata.forEach(async ({version, changelogPath}) => {
  const initial = readFileSync(changelogPath);
  const date = new Date();

  const newChangelog = await transform(
    initial.toString(),
    addReleaseToChangelog({
      version,
      date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      notes: '- Package dependency bump',
    }),
  );

  writeFileSync(changelogPath, newChangelog);
});
