import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync, existsSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');

const HEADER_START_REGEX = /^## /;
const CHANGELOG_INTRO = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).`;

readChangelogs().forEach(({packageChangelogPath, packageChangelog}) => {
  describe(`changelog consistency for ${packageChangelogPath}`, () => {
    it('begins with the "Keep a Changelog" intro section', () => {
      const actualIntro = packageChangelog.substring(0, CHANGELOG_INTRO.length);

      expect(actualIntro).toBe(CHANGELOG_INTRO);
    });

    it('contains only known headers', () => {
      const headerLines = packageChangelog
        .split('\n')
        .filter(line => /^\s*#/.exec(line));
      const offendingHeaders = headerLines.filter(
        headerLine => !headerIsAllowed(headerLine),
      );

      expect(offendingHeaders).toStrictEqual([]);
    });

    it('has exactly 1 empty line before headings', () => {
      const notEnoughSpacingBeforeHeadings = /[^\n]+\n^#.*$/gm;

      expect(packageChangelog).not.toStrictEqual(
        expect.stringMatching(notEnoughSpacingBeforeHeadings),
      );
    });

    it('has exactly 1 empty line after headings', () => {
      const notEnoughSpacingAfterHeadings = /^#.*$\n[^\n]+/gm;

      expect(packageChangelog).not.toStrictEqual(
        expect.stringMatching(notEnoughSpacingAfterHeadings),
      );
    });

    it('does not contain duplicate headers', () => {
      const headerLines = packageChangelog
        .split('\n')
        .filter(
          line =>
            HEADER_START_REGEX.exec(line) || /## \[Unreleased\]/.exec(line),
        )
        .sort();
      const uniqueHeaderLines = headerLines.filter(
        (element, index, array) => array.indexOf(element) === index,
      );

      expect(headerLines).toStrictEqual(uniqueHeaderLines);
    });
  });
});

const allowedHeaders = [
  '# Changelog',
  '## [Unreleased]',
  /^## \[\d+\.\d+\.\d+\] - \d\d\d\d-\d\d-\d\d$/,
  // We should backfill dates using commit timestamps
  /^## \[\d+\.\d+\.\d+\]$/,
  '### Fixed',
  '### Added',
  '### Changed',
  '### Deprecated',
  '### Removed',
  '### Security',
  // This is technically not part of Keep a Changelog spec
  '### Chore',
  // This isn't part of it either
  '### Breaking Change',
  /^####/,
];

function headerIsAllowed(headerLine) {
  return allowedHeaders.some(allowedHeader => {
    if (allowedHeader instanceof RegExp) {
      return allowedHeader.test(headerLine);
    } else {
      return allowedHeader === headerLine;
    }
  });
}

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
        packageDir,
        packageChangelogPath,
        packageChangelog,
      };
    });
}

function safeReadSync(path, options) {
  try {
    return readFileSync(path, options);
  } catch {
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
