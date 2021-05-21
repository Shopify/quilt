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

/**
 * Default Axe rule overrides
 */
export const SENSIBLE_RULE_OVERRIDES: axeCore.Rule[] = [
  {
    // Allow `autocomplete="nope"` on form elements,
    // a workaround to disable autofill in Chrome.
    // @link https://bugs.chromium.org/p/chromium/issues/detail?id=468153
    // @link https://development.shopify.io/engineering/developing_at_Shopify/accessibility/forms/autocomplete
    // @link https://dequeuniversity.com/rules/axe/4.1/autocomplete-valid
    id: 'autocomplete-valid',
    selector: '*:not([autocomplete="nope"])',
  },
];

const FORMATTING_SPACER = '    ';

const getBrowser = () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
};

/**
 * Get all Story IDs, except the ones that have story.parameters.a11y.disabled set
 * @param iframePath {string} URI to iframe.html
 */
export const getStoryIds = async (
  iframePath = 'http://localhost:6006/iframe.html',
) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(iframePath);

  const storyIds = await page.evaluate(() =>
    Object.keys(window.__STORYBOOK_STORY_STORE__.extract()),
  );

  const disabledStoryIds = await page.evaluate(() =>
    window.__STORYBOOK_STORY_STORE__
      .raw()
      .filter(story => story.parameters.a11y && story.parameters.a11y.disable)
      .map(story => story.id),
  );

  await page.close();
  await browser.close();

  return storyIds.filter(storyId => !disabledStoryIds.includes(storyId));
};

const formatFailureNodes = nodes => {
  return `${FORMATTING_SPACER}${nodes
    .map(node => node.html)
    .join(`\n${FORMATTING_SPACER}`)}`;
};

const formatMessage = (id: string, violations: axeCore.Result[]) => {
  return violations
    .map(fail => {
      return `- FAIL: ${id}\n  Error: ${
        fail.help
      }\n  Violating node(s):\n${formatFailureNodes(
        fail.nodes,
      )}\n  For help resolving this see: ${fail.helpUrl}`;
    })
    .join('\n');
};

const testPage = (
  iframePath: string,
  browser: puppeteer.Browser,
  timeout: number,
) => {
  return async (id: string) => {
    console.log(` - ${id}`);

    try {
      const page = await browser.newPage();
      await page.goto(`${iframePath}?id=${id}`, {waitUntil: 'load', timeout});
      const axeResults = await page.evaluate(() => {
        const story = window.__STORYBOOK_STORY_STORE__.fromId(id)!;
        // optional selector which element to inspect
        const axeElement: axeCore.ElementContext =
          story.parameters.a11y && story.parameters.a11y.element;
        // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
        const axeConfig: axeCore.Spec =
          story.parameters.a11y && story.parameters.a11y.config;
        // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
        const axeOptions: axeCore.RunOptions =
          story.parameters.a11y && story.parameters.a11y.options;

        window.axe.configure(axeConfig || {});

        return (window.axe.run(
          axeElement || document.getElementById('root')!,
          axeOptions || {},
          (err, results) => {
            if (err) {
              throw err;
            }
            return results;
          },
        ) as unknown) as axeCore.AxeResults;
      });
      await page.close();

      if (axeResults.violations.length) {
        return formatMessage(id, axeResults.violations);
      }

      return null;
    } catch (error) {
      return `please retry => ${id}:\n - ${error.message}`;
    }
  };
};

export const testPages = async ({
  storyIds,
  iframePath = 'http://localhost:6006/iframe.html',
  concurrentCount = os.cpus().length,
  timeout = 30000,
}: {
  storyIds: string[];
  iframePath?: string;
  concurrentCount?: number;
  timeout?: number;
}) => {
  try {
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in Chromium`));
    const browser = await getBrowser();

    console.log(chalk.bold(`🧪 Testing ${storyIds.length} urls with axe`));
    const results = await pMap(
      storyIds,
      testPage(iframePath, browser, timeout),
      {
        concurrency: concurrentCount,
      },
    );

    await browser.close();

    return results.filter(x => x);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
