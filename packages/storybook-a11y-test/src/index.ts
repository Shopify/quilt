/* eslint-disable no-console */
import os from 'os';

import puppeteer from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import {StoryStore} from '@storybook/client-api';
import axeCore from 'axe-core';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore;
    axe: typeof axeCore;
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

const formatFailureNodes = (nodes: axeCore.NodeResult[]) => {
  return `${FORMATTING_SPACER}${nodes
    .map((node) => node.html)
    .join(`\n${FORMATTING_SPACER}`)}`;
};

const formatMessage = (id: string, violations: axeCore.Result[]) => {
  return violations
    .map((fail) => {
      return `
- Story ID: ${id}
  Error: ${fail.help} (${fail.id})
  Affected node(s):
${formatFailureNodes(fail.nodes)}
  For help resolving this see: ${fail.helpUrl}`.trim();
    })
    .join('\n');
};

// This check is added specifically for autocomplete="nope"
// https://bugs.chromium.org/p/chromium/issues/detail?id=468153
// This is necessary to prevent autocomplete in chrome and fails the axe test
// Do not disable accessibility tests if you notice a failure please fix the issue
const isAutocompleteNope = (violation: axeCore.Result) => {
  const isAutocompleteAttribute = violation.id === 'autocomplete-valid';
  const hasNope = violation.nodes.every((node) =>
    node.html.includes('autocomplete="nope"'),
  );
  return isAutocompleteAttribute && hasNope;
};

const testPage = (
  iframePath: string,
  browser: puppeteer.Browser,
  timeout: number,
  disableAnimation: boolean,
) => {
  return async (id: string) => {
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
      const result: axeCore.AxeResults = await page.evaluate((id) => {
        const story = window.__STORYBOOK_STORY_STORE__.fromId(id)!;

        // optional selector which element to inspect
        const axeElement: axeCore.ElementContext | undefined =
          story.parameters.a11y && story.parameters.a11y.element;

        // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
        const axeConfig: axeCore.Spec =
          (story.parameters.a11y && story.parameters.a11y.config) || {};

        // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
        const axeOptions: axeCore.RunOptions =
          (story.parameters.a11y && story.parameters.a11y.options) || {};

        window.axe.configure(axeConfig);

        return window.axe
          .run(axeElement || document.getElementById('root')!, axeOptions)
          .then((results) => {
            return results;
          })
          .catch((err) => err);
      }, id);
      await page.close();

      if (result.violations && result.violations.length) {
        const filteredViolations = result.violations.filter(
          (violation) => !isAutocompleteNope(violation),
        );

        return formatMessage(id, filteredViolations);
      }

      return null;
    } catch (err) {
      return `please retry => ${id}:\n - ${err.message}`;
    }
  };
};

export const testPages = async ({
  iframePath,
  storyIds = [],
  concurrentCount = os.cpus().length,
  timeout = 30000,
  disableAnimation = false,
}: {
  iframePath: string;
  storyIds: string[];
  concurrentCount?: number;
  timeout?: number;
  disableAnimation?: boolean;
}) => {
  try {
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in Chromium`));
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
