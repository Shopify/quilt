/* eslint-disable no-console */
import os from 'os';

import puppeteer, { Browser } from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import type { StoryStore } from '@storybook/client-api';
import type { StoryId } from '@storybook/addons';
import { AxePuppeteer } from '@axe-core/puppeteer';

// unwraps a promise
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
// unwraps an array
type Unpacked<T> = T extends (infer U)[] ? U : T;

// This is rather silly but it allows us to get at the axe.Result type, without
// adding a direct dependency upon axe-core
// It'd be nice if @axe-core/puppeteer reexported axe.AxeResults / axe.Result
// so we didn't have to do this
type AxeResults = NonNullable<Awaited<ReturnType<AxePuppeteer['analyze']>>>;
type ViolationResult = Unpacked<AxeResults['violations']>;

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore<any>;
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

  await page.evaluate(async () => {
    if (typeof window.__STORYBOOK_STORY_STORE__.cacheAllCSFFiles === 'function') {
      await window.__STORYBOOK_STORY_STORE__.cacheAllCSFFiles()
    }
  });

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

async function getA11yParams(storyId: StoryId, browser: Browser, iframePath: string) {
  const page = await browser.newPage();
  await page.goto(iframePath);

  const parameters =
    (await page.evaluate(async (storyId) => {
      if (typeof window.__STORYBOOK_STORY_STORE__.loadStory === 'function') {
        const story = await window.__STORYBOOK_STORY_STORE__.loadStory(
          storyId,
        )!;
        return story.parameters;
      } else {
        const story = window.__STORYBOOK_STORY_STORE__.fromId(storyId)!;
        return story.parameters;
      }
    }, storyId)) || {};

  await page.close();

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

function formatFailureNodes(nodes: ViolationResult['nodes']) {
  return `${FORMATTING_SPACER}${nodes
    .map((node) => node.html)
    .join(`\n${FORMATTING_SPACER}`)}`;
}

function formatMessage(
  id: ViolationResult['id'],
  violations: ViolationResult[],
) {
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
function isAutocompleteNope(violation: ViolationResult) {
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

    const a11yParams = await getA11yParams(id, browser, iframePath);

    if (a11yParams?.disable) {
      console.log(` - ${id}: Skipped (a11y.disable)`);
    } else {
      console.log(` - ${id}`);
    }

    const config = a11yParams.config ? a11yParams.config : {};
    const options = a11yParams.options ? a11yParams.options : {};

    try {
      const page = await browser.newPage();

      await page.goto(`${iframePath}?id=${id}`, { waitUntil: 'load', timeout });

      if (disableAnimation) {
        await page.addStyleTag({
          content: `*,
            *::after,
            *::before {
              transition: none !important;
              transition-delay: 0s !important;
              transition-duration: 0s !important;
              animation: none !important;
              animation-delay: 0s !important;
              animation-duration: 0s !important;
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
    } catch (error) {
      return `please retry => ${id}:\n - ${error.message}`;
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
    console.error(error);
    process.exit(1);
  }
}
