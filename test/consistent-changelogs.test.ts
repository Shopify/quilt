import {dirname, join, relative, resolve} from 'path';

import {readFileSync, readJSONSync, existsSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');

const CHANGELOG_INTRO = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).`

readChangelogs().forEach(({packageDir, packageChangelogPath, packageChangelog}) => {
  describe(packageChangelogPath, () => {
    it('begins with the "Keep a Changelog" intro section ', () => {
      const actualIntro = packageChangelog.substring(0, CHANGELOG_INTRO.length);

      expect(actualIntro).toBe(CHANGELOG_INTRO);
    });

    it('has Unreleased section as first subheading', () => {
      const firstSubheading = packageChangelog.split('\n').find(line => line.match(/^## /));

      expect(firstSubheading).toBe('## [Unreleased]');
    });

//     it('contains an unreleased section after the intro', () => {
//       const searchArea = packageChangelog.slice(0, CHANGELOG_INTRO.length + 100);

//       const regex = new RegExp(
//         '^' + escapeRegExp(CHANGELOG_INTRO) + '$\n\n^' + escapeRegExp('## [Unreleased]') + '$',
//         'm',
//       );

//       expect(searchArea).toEqual(expect.stringMatching(regex));
//     });



    // it('contains an unreleased section after the intro', () => {
    //   const afterIntro = packageChangelog.replace(CHANGELOG_INTRO, '').slice(0, 50);

    //   const unreleasedHeader = escapeRegExp('## [Unreleased]');
    //   const unreleasedPlaceholder = escapeRegExp('<!-- ## [Unreleased] -->');
    //   const regex = new RegExp(
    //     `^(${unreleasedHeader})|(${unreleasedPlaceholder})$`,
    //     'm',
    //   );

    //   expect(afterIntro).toEqual(expect.stringMatching(regex));
    // });

    it('contains only known headers', () => {
      const headerLines = packageChangelog.split('\n').filter(line => line.match(/^\s*#/));
      const offendingHeaders = headerLines.filter(headerLine => !headerIsAllowed(headerLine));

      expect(offendingHeaders).toEqual([]);
    });

    it('has exactly 1 empty line before headings', () => {
      const notEnoughSpacingBeforeHeadings = /[^\n]+\n^#.*$/gm;

      expect(packageChangelog).not.toEqual(expect.stringMatching(notEnoughSpacingBeforeHeadings));
    });

    it('has exactly 1 empty line after headings', () => {
      const notEnoughSpacingAfterHeadings = /^#.*$\n[^\n]+/gm;

      expect(packageChangelog).not.toEqual(expect.stringMatching(notEnoughSpacingAfterHeadings));
    });

    it('does not contain duplicate headers', () => {
      const headerLines = packageChangelog.split('\n').filter(line => line.match(/^## /) || line.match(/## \[Unreleased\]/)).sort();
      const uniqueHeaderLines = headerLines.filter((element, index, array) => array.indexOf(element) === index)

      expect(headerLines).toEqual(uniqueHeaderLines);
    });
  });
});

const WIP = /(?:[^\n]+(?:\n\n+)?\n^#.*$)|(?:^#.*$\n(?:\n\n+)?[^\n]+)/gm;

const NOT_EXACTLY_ONE_LINE_BEFORE_HEADINGS_REGEX = /^#.*$\n[^\n]+/gm;
const NOT_EXACTLY_ONE_LINE_AFTER_HEADINGS_REGEX = /^#.*$\n[^\n]+/gm;

const allowedHeaders = [
  '# Changelog',
  '## [Unreleased]',
  /^## \[\d+\.\d+\.\d+\] - \d\d\d\d-\d\d-\d\d$/,
  /^## \[\d+\.\d+\.\d+\]$/, // We should backfill dates using commit timestamps
  '### Fixed',
  '### Added',
  '### Changed',
  '### Deprecated',
  '### Removed',
  '### Fixed',
  '### Security',
  '### Chore', // This is technically not part of Keep a Changelog spec
  '### Breaking Change', // This isn't part of it either
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

