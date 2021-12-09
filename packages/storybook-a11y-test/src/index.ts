/* eslint-disable no-console */
import os from 'os';

import puppeteer from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import type {StoryStore} from '@storybook/client-api';
import type {StoryId} from '@storybook/addons';
import axeCore from 'axe-core';
import {AxePuppeteer} from '@axe-core/puppeteer';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore;
  }
}

const FORMATTING_SPACER = '    ';

function getBrowser() {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

export async function getStoryIds(iframePath: string) {
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
}

function removeSkippedStories(skippedStoryIds: StoryId[]) {
  return (selectedStories: StoryId[] = [], storyId = '') => {
    if (skippedStoryIds.every((skipId) => !storyId.includes(skipId))) {
      return [...selectedStories, storyId];
    }
    return selectedStories;
  };
}

async function getA11yParams(storyId: StoryId, iframePath: string) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(iframePath);

  const parameters = await page.evaluate((storyId) => {
    const {parameters} = window.__STORYBOOK_STORY_STORE__.fromId(storyId)!;
    return parameters;
  }, storyId);

  await page.close();
  await browser.close();

  return (
    parameters.a11y || {
      config: {},
      options: {
        restoreScroll: true,
      },
    }
  );
}

export async function getCurrentStoryIds({
  iframePath,
  skippedStoryIds = [],
}: {
  iframePath: string;
  skippedStoryIds: StoryId[];
}) {
  const stories =
    process.argv[2] == null
      ? await getStoryIds(iframePath)
      : process.argv[2].split('|');

  return stories.reduce(removeSkippedStories(skippedStoryIds), []);
}

function formatFailureNodes(nodes: axeCore.NodeResult[]) {
  return `${FORMATTING_SPACER}${nodes
    .map((node) => node.html)
    .join(`\n${FORMATTING_SPACER}`)}`;
}

function formatMessage(id: axeCore.Result['id'], violations: axeCore.Result[]) {
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
}

// This check is added specifically for autocomplete="nope"
// https://bugs.chromium.org/p/chromium/issues/detail?id=468153
// This is necessary to prevent autocomplete in chrome and fails the axe test
// Do not disable accessibility tests if you notice a failure please fix the issue
function isAutocompleteNope(violation: axeCore.Result) {
  const isAutocompleteAttribute = violation.id === 'autocomplete-valid';
  const hasNope = violation.nodes.every((node) =>
    node.html.includes('autocomplete="nope"'),
  );
  return isAutocompleteAttribute && hasNope;
}

function testPage(
  iframePath: string,
  browser: puppeteer.Browser,
  timeout: number,
  disableAnimation: boolean,
) {
  return async function (id: StoryId) {
    console.log(` - ${id}`);

    const a11yParams = await getA11yParams(id, iframePath);

    const config = a11yParams.config ? a11yParams.config : {};
    const options = a11yParams.options ? a11yParams.options : {};

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

      const results = await new AxePuppeteer(page)
        .include('#root')
        .configure(config)
        .options(options)
        .analyze();

      await page.close();

      if (results.violations && results.violations.length) {
        const filteredViolations = results.violations.filter(
          (violation) => !isAutocompleteNope(violation),
        );

        return formatMessage(id, filteredViolations);
      }

      return null;
    } catch (err) {
      return `please retry => ${id}:\n - ${err.message}`;
    }
  };
}

export async function testPages({
  iframePath,
  storyIds = [],
  concurrentCount = os.cpus().length,
  timeout = 3000,
  disableAnimation = false,
}: {
  iframePath: string;
  storyIds: StoryId[];
  concurrentCount?: number;
  timeout?: number;
  disableAnimation?: boolean;
}) {
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
}
