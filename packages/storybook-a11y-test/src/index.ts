/* eslint-disable no-console */
import os from 'os';

import puppeteer from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import {StoryStore} from '@storybook/client-api';
import axe from 'axe-core';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore;
    axe: typeof axe;
  }
}

const getStoriesWithUrls = async (
  browser: any,
  iframePath: string,
  skippedStoryIds: string[] = [],
) => {
  // Get the URLS from storybook
  const page = await browser.newPage();
  await page.goto(iframePath);
  console.log(iframePath);

  const stories = await page.evaluate(
    async () => await window.__STORYBOOK_STORY_STORE__.extract(),
  );
  console.log(stories);

  await page.close();

  return stories;
};

const formatFailureNodes = nodes => {
  return `    ${nodes.map(node => node.html).join('\n    ')}`;
};

const formatMessage = (id, violations) => {
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

export async function storybookA11yTest({
  iframePath,
  skippedStoryIds = [],
  concurrentCount = os.cpus().length,
}) {
  try {
    // Open a browser
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in chromium`));
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Get the test ids from storybook
    const testIds = await getStoriesWithUrls(
      browser,
      iframePath,
      skippedStoryIds,
    );

    console.log(chalk.bold(`🧪 Testing ${testIds.length} urls with axe`));

    // Test the pages with axe
    const testPage = async story => {
      console.log(` - ${story.id}`);

      try {
        const page = await browser.newPage();
        await page.goto(story.url);
        const result = await page.evaluate(() => {
          window.axe.configure(story.parameters.a11y?.config || {});
          window.axe.run(
            story.parameters.a11y?.element || document.getElementById('root')!,
            story.parameters.a11y?.options || {},
          );
        });
        await page.close();

        if (result.violations.length) {
          return formatMessage(story.id, result.violations);
        }
      } catch (error) {
        return `please retry => ${story.id}:\n - ${error.message}`;
      }
    };

    const results = await pMap(testIds, testPage, {
      concurrency: concurrentCount,
    });
    await browser.close();

    // Format the results and log them out
    return results.filter(x => x);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
