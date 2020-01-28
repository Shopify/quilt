import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync, existsSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');

const CHANGELOG_INTRO = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

`

readChangelogs().forEach(({packageDir, packageChangelogPath, packageChangelog}) => {
  describe(packageChangelogPath, () => {
    it('begins with the "Keep a Changelog" intro section ', () => {
      const actualIntro = packageChangelog.substring(0, CHANGELOG_INTRO.length);

      expect(actualIntro).toBe(CHANGELOG_INTRO);
    });

    it('contains an unreleased section after the intro', () => {
      const afterIntro = packageChangelog.replace(CHANGELOG_INTRO, '').slice(0, 50);

      const unreleasedHeader = escapeRegExp('## [Unreleased]');
      const unreleasedPlaceholder = escapeRegExp('<!-- ## [Unreleased] -->');
      const regex = new RegExp(
        `^(${unreleasedHeader})|(${unreleasedPlaceholder})$`,
        'm',
      );

      expect(afterIntro).toEqual(expect.stringMatching(regex));
    });

    it('contains only known headers', () => {
      const headerLines = packageChangelog.split('\n').filter(line => line.match(/^\s*#/));
      const offendingHeaders = headerLines.filter(headerLine => !headerIsAllowed(headerLine));

      expect(offendingHeaders).toEqual([]);
    });

    it('does not contain duplicate headers', () => {
      const headerLines = packageChangelog.split('\n').filter(line => line.match(/^## /) || line.match(/## \[Unreleased\]/)).sort();
      const uniqueHeaderLines = headerLines.filter((element, index, array) => array.indexOf(element) === index)

      expect(headerLines).toEqual(uniqueHeaderLines);
    });
  });
});

const allowedHeaders = [
  '# Changelog',
  '## [Unreleased]',
  /^## \[\d+\.\d+\.\d+\] - \d\d\d\d-\d\d-\d\d$/,
  /^## \[\d+\.\d+\.\d+\]$/, // FIXME: We should backfill dates using commit timestamps
  '### Fixed',
  '### Added',
  '### Changed',
  '### Deprecated',
  '### Removed',
  '### Fixed',
  '### Security',
  '### Chore',
  '### Breaking Change',
  /^####/,
];

function headerIsAllowed(headerLine) {
  return allowedHeaders.some(allowedHeader => {
    if (allowedHeader instanceof RegExp) {
      return allowedHeader.test(headerLine);
    } else {
      return allowedHeader === headerLine;
    };
  });
}

function readChangelogs() {
  const packagesPath = join(ROOT_PATH, 'packages');

  return glob
    .sync(join(packagesPath, '*/'))
    //.slice(0, 2)
    .map(packageDir => {
      const packageChangelogPath = join(packageDir, 'CHANGELOG.md');
      const packageChangelog = safeReadSync(packageChangelogPath, {encoding: 'utf8'});

      return {
        packageDir,
        packageChangelogPath,
        packageChangelog,
      };
    });
}

function safeReadSync(path, options={}) {
  try {
    return readFileSync(path, options);
  } catch {
    return '';
  }
}

// From MDN
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

