/* global __dirname process */
/* eslint-disable no-console */
const {join, resolve} = require('path');

const {readFileSync} = require('fs-extra');
const glob = require('glob');

const ROOT_PATH = resolve(__dirname, '..');

const changelogs = readChangelogs();
console.log(`🕵️‍♂️  Checking ${changelogs.length} changelogs`);

const haveUnreleasedHeader = changelogs.filter(({packageChangelog}) =>
  packageChangelog.split('\n').find(line => /^## \[Unreleased\]/.exec(line)),
);

if (haveUnreleasedHeader.length > 0) {
  console.error(
    [
      `❌ Found uncommented "## [Unreleased]" headers in one or more changelogs. These file(s) should be kept in-synch with the version(s) you are releasing. Update all changelogs to reflect the version you intend to release or the last released version and run yarn release again.`,
      'Violations:',
      ...haveUnreleasedHeader.map(
        ({packageChangelogPath}) => `- ${packageChangelogPath}`,
      ),
    ].join('\n'),
  );
  process.exit(1);
}

console.log('✅ All changelogs are ready for release!');

function readChangelogs() {
  const packagesPath = join(ROOT_PATH, 'packages');

  return glob
    .sync(join(packagesPath, '*/'))
    .filter(hasPackageJSON)
    .map(packageDir => {
      const packageChangelogPath = join(packageDir, 'CHANGELOG.md');
      const packageChangelog = safeReadSync(packageChangelogPath, {
        encoding: 'utf8',
      }).toString('utf-8');

      return {
        packageChangelogPath,
        packageChangelog,
      };
    });
}

function safeReadSync(path, options) {
  try {
    return readFileSync(path, options);
  } catch (err) {
    return '';
  }
}

function hasPackageJSON(packageDir) {
  const packageJSONPath = join(packageDir, 'package.json');
  const packageJSON = safeReadSync(packageJSONPath, {
    encoding: 'utf8',
  });

  return packageJSON.length > 0;
}
