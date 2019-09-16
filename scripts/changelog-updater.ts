import {execSync} from 'child_process';
import {resolve, join} from 'path';
import glob from 'glob';

const root = resolve(__dirname, '..');
const packagesDir = join(root, 'packages');

const tagsOnHead = execSync('git --no-pager tag --contains e0d0d3ba', {
  encoding: 'utf8',
}).trim();

const taggedPackagesMetadata = tagsOnHead.split('\n').map(line => {
  const [, packageName, version] = line.split('@');

  const folder = packageName && packageName.split('/')[1];
  const changelog = glob.sync(join(packagesDir, folder, 'CHANGELOG.md'))[0];

  return {
    package: `@${packageName}`,
    version,
    changelog,
  };
});

console.log('taggedPackagesMetadata: ', taggedPackagesMetadata);
