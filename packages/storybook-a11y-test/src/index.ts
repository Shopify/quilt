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

const getUrls = async (browser, iframePath, skippedStoryIds) => {
  // Get the URLS from storybook
  const page = await browser.newPage();
  await page.goto(iframePath);

  const storyIds = await page.evaluate(() =>
    Object.keys(window.__STORYBOOK_STORY_STORE__.extract()),
  );

  const skippedParams = await page.evaluate(() =>
    window.__STORYBOOK_STORY_STORE__
      .raw()
      .filter(story => story.parameters.a11y && story.parameters.a11y.disable)
      .map(story => story.id),
  );

  const skipIds = skippedStoryIds.concat(skippedParams);

  await page.close();

  const urls: string[] = [];
  for (const id of storyIds) {
    if (skipIds.every(skipId => !id.includes(skipId))) {
      urls.push(`${iframePath}?id=${id}`);
    }
  }

  return urls;
};

const formatFailureNodes = nodes => {
  return `    ${nodes.map(node => node.html).join('\n    ')}`;
};

const formatFailureId = id => {
  return id.split('iframe.html?')[1];
};

const formatMessage = (id, violations) => {
  return violations
    .map(fail => {
      return `- FAIL: ${formatFailureId(id)}\n  Error: ${
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
const isAutcompleteNope = violation => {
  const isAutocompleteAttribute = violation.id === 'autocomplete-valid';
  const hasNope = violation.nodes.every(node =>
    node.html.includes('autocomplete="nope"'),
  );
  return isAutocompleteAttribute && hasNope;
};

export async function storybookA11yTest({
  iframePath,
  skippedStoryIds = [],
  concurrentCount = os.cpus().length,
  timeout = 3000,
}) {
  try {
    // Open a browser
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in chromium`));
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Get the test ids from storybook
    const testIds = await getUrls(browser, iframePath, skippedStoryIds);

    console.log(chalk.bold(`🧪 Testing ${testIds.length} urls with axe`));

    // Test the pages with axe
    const testPage = async url => {
      const id = url.replace(`${iframePath}?id=all-components-`, '');
      console.log(` - ${id}`);

      try {
        const page = await browser.newPage();
        await page.goto(url, {timeout});
        const result = await page.evaluate(() =>
          window.axe.run(document.getElementById('root'), {}),
        );
        await page.close();

        if (result.violations.length) {
          const filteredViolations = result.violations.filter(
            violation => !isAutcompleteNope(violation),
          );

          return formatMessage(id, filteredViolations);
        }
      } catch (error) {
        return `please retry => ${id}:\n - ${error.message}`;
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
