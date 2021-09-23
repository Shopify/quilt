/* eslint-disable no-console */
import os from 'os';

import puppeteer from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import type {StoryStore} from '@storybook/client-api';
import type {StoryId} from '@storybook/addons';
import type {A11yParameters} from '@storybook/addon-a11y/dist/ts3.9/params';
import axeCore from 'axe-core';
import type {ElementContext} from 'axe-core';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore;
    axe: typeof axeCore;
  }
}

// Until https://github.com/dequelabs/axe-core/pull/3161 is fixed
type A11yParametersElement = A11yParameters['element'] | NodeList;

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
      const result: axeCore.AxeResults = await page.evaluate(
        async (id: StoryId) => {
          // Implementation matching
          function getElement(): A11yParametersElement {
            const storyRoot = document.getElementById('story-root');
            return storyRoot
              ? storyRoot.childNodes
              : document.getElementById('root')!;
          }

          // Returns story parameters or default ones.
          // Originally inspired by:
          // https://github.com/storybookjs/storybook/blob/78c580eac4c91231b5966116492e34de0a0df66f/addons/a11y/src/a11yRunner.ts#L69-L80
          function getA11yParams(storyId: StoryId): A11yParameters {
            const {parameters} = window.__STORYBOOK_STORY_STORE__.fromId(
              storyId,
            )!;

            return (
              parameters.a11y || {
                config: {},
                options: {
                  restoreScroll: true,
                },
              }
            );
          }

          const storyA11yParams = getA11yParams(id);

          const {
            // Context for axe to analyze
            // https://www.deque.com/axe/core-documentation/api-documentation/#context-parameter
            element = getElement(),
            // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
            config,
            // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
            options = {},
          } = storyA11yParams;

          window.axe.reset();

          if (config) {
            window.axe.configure(config);
          }

          return window.axe.run(element as ElementContext, options);
        },
        id,
      );

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
