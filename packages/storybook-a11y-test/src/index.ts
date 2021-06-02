/* eslint-disable no-console */
import os from 'os';

import puppeteer from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: any;
    axe: any;
  }
}

const FORMATTING_SPACER = '    ';

const getBrowser = () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
};

export const getStoryIds = async (iframePath: string) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(iframePath);

  const storyIds = await page.evaluate(() =>
    Object.keys(window.__STORYBOOK_STORY_STORE__.extract()),
  );

  const disabledStoryIds = await page.evaluate(() =>
    window.__STORYBOOK_STORY_STORE__
      .raw()
      .filter((story) => story.parameters.a11y && story.parameters.a11y.disable)
      .map((story) => story.id),
  );

  await page.close();
  await browser.close();

  return storyIds.filter((storyId) => !disabledStoryIds.includes(storyId));
};

const removeSkippedStories = (skippedStoryIds: string[]) => {
  return (selectedStories: string[] = [], storyId = '') => {
    if (skippedStoryIds.every((skipId) => !storyId.includes(skipId))) {
      return [...selectedStories, storyId];
    }
    return selectedStories;
  };
};

export const getCurrentStoryIds = async ({
  iframePath,
  skippedStoryIds = [],
}: {
  iframePath: string;
  skippedStoryIds: string[];
}) => {
  const stories =
    process.argv[2] == null
      ? await getStoryIds(iframePath)
      : process.argv[2].split('|');

  return stories.reduce(removeSkippedStories(skippedStoryIds), []);
};

const formatFailureNodes = (nodes) => {
  return `${FORMATTING_SPACER}${nodes
    .map((node) => node.html)
    .join(`\n${FORMATTING_SPACER}`)}`;
};

const formatMessage = (id, violations) => {
  return violations
    .map((fail) => {
      return `- FAIL: ${id}\n  Error: ${
        fail.help
      }\n  Violating node(s):\n${formatFailureNodes(
        fail.nodes,
      )}\n  For help resolving this see: ${fail.helpUrl}`;
    })
    .join('\n');
};

// This check is added specifically for autocomplete="nope"
// https://bugs.chromium.org/p/chromium/issues/detail?id=468153
// This is necessary to prevent autocomplete in chrome and fails the axe test
// Do not disable accessibility tests if you notice a failure please fix the issue
const isAutcompleteNope = (violation) => {
  const isAutocompleteAttribute = violation.id === 'autocomplete-valid';
  const hasNope = violation.nodes.every((node) =>
    node.html.includes('autocomplete="nope"'),
  );
  return isAutocompleteAttribute && hasNope;
};

const testPage = (iframePath, browser, timeout, disableAnimation) => {
  return async (id) => {
    console.log(` - ${id}`);

    try {
      const page = await browser.newPage();
      await page.goto(`${iframePath}?id=${id}`, {waitUntil: 'load', timeout});
      if (disableAnimation) {
        await page.addStyleTag({
          content: `*,
            *::after,
            *::before {
              transition-delay: 0.0001s !important;
              transition-duration: 0.0001s !important;
              animation-delay: -0.0001s !important;
              animation-duration: 0.0001s !important;
            }`,
        });
      }
      const result = await page.evaluate(() =>
        window.axe.run(document.getElementById('root'), {}),
      );
      await page.close();

      if (result.violations.length) {
        const filteredViolations = result.violations.filter(
          (violation) => !isAutcompleteNope(violation),
        );

        return formatMessage(id, filteredViolations);
      }

      return null;
    } catch (error) {
      return `please retry => ${id}:\n - ${error.message}`;
    }
  };
};

export const testPages = async ({
  iframePath,
  storyIds = [],
  concurrentCount = os.cpus().length,
  timeout = 3000,
  disableAnimation = false,
}: {
  iframePath: string;
  storyIds: string[];
  concurrentCount?: number;
  timeout?: number;
  disableAnimation?: boolean;
}) => {
  try {
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in chromium`));
    const browser = await getBrowser();

    console.log(chalk.bold(`🧪 Testing ${storyIds.length} urls with axe`));
    const results = await pMap(
      storyIds,
      testPage(iframePath, browser, timeout, disableAnimation),
      {
        concurrency: concurrentCount,
      },
    );

    await browser.close();

    return results.filter((x) => x);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
