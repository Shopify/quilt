/* eslint-disable no-console */
import os from 'os';

import puppeteer, {Browser, Page} from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import type {StoryStore} from '@storybook/client-api';
import type {StoryId} from '@storybook/addons';
import {AxePuppeteer} from '@axe-core/puppeteer';

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
    __STORYBOOK_STORY_STORE__: StoryStore;
  }
}

const FORMATTING_SPACER = '    ';

export class A11yTests {
  #browser: Browser | undefined;
  #iframePage: Page | undefined;
  iframePath: string;

  constructor(iframePath: string) {
    this.iframePath = iframePath;
  }

  async allStoryIds() {
    const page = await this.iframePage();
    const storyIds = await page.evaluate(() =>
      Object.keys(window.__STORYBOOK_STORY_STORE__.extract()),
    );

    const disabledStoryIds = await page.evaluate(() =>
      window.__STORYBOOK_STORY_STORE__
        .raw()
        .filter(
          (story) => story.parameters.a11y && story.parameters.a11y.disable,
        )
        .map((story) => story.id),
    );

    return storyIds.filter((storyId) => !disabledStoryIds.includes(storyId));
  }

  async currentStoryIds({
    storyIds,
    skippedStoryIds = [],
  }: {
    storyIds?: StoryId[];
    skippedStoryIds: StoryId[];
  }) {
    const stories = storyIds || (await this.allStoryIds());

    return stories.reduce(removeSkippedStories(skippedStoryIds), []);
  }

  async testStories({
    storyIds = [],
    concurrentCount = os.cpus().length,
    timeout = 3000,
    disableAnimation = false,
  }: {
    storyIds: StoryId[];
    concurrentCount?: number;
    timeout?: number;
    disableAnimation?: boolean;
  }) {
    console.log(chalk.bold(`🌐 Opening ${concurrentCount} tabs in Chromium`));
    console.log(chalk.bold(`🧪 Testing ${storyIds.length} urls with axe`));
    const results = await pMap(
      storyIds,
      this.generateTestStoryFunction(timeout, disableAnimation),
      {
        concurrency: concurrentCount,
      },
    );

    return results.filter((x) => x);
  }

  async teardown() {
    if (this.#iframePage && !this.#iframePage.isClosed) {
      await this.#iframePage.close();
    }
    if (this.#browser && this.#browser.isConnected) {
      await this.#browser.close();
    }
  }

  private generateTestStoryFunction(
    timeout: number,
    disableAnimation: boolean,
  ) {
    return async (id: StoryId) => {
      console.log(` - ${id}`);

      const a11yParams = await this.storyA11yParams(id);

      const config = a11yParams.config ? a11yParams.config : {};
      const options = a11yParams.options ? a11yParams.options : {};

      try {
        const browser = await this.browser();
        const page = await browser.newPage();

        await page.goto(`${this.iframePath}?id=${id}`, {
          waitUntil: 'load',
          timeout,
        });

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

  private async browser() {
    if (!this.#browser) {
      this.#browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.#browser;
  }

  private async iframePage() {
    if (!this.#iframePage) {
      this.#iframePage = await (await this.browser()).newPage();
      await this.#iframePage.goto(this.iframePath);
    }
    return this.#iframePage;
  }

  private async storyA11yParams(storyId: StoryId) {
    const page = await this.iframePage();

    const parameters =
      (await page.evaluate((storyId) => {
        const {parameters} = window.__STORYBOOK_STORY_STORE__.fromId(storyId)!;
        return parameters;
      }, storyId)) || {};

    return (
      parameters.a11y || {
        config: {},
        options: {
          restoreScroll: true,
        },
      }
    );
  }
}

function removeSkippedStories(skippedStoryIds: StoryId[]) {
  return (selectedStories: StoryId[] = [], storyId = '') => {
    if (skippedStoryIds.every((skipId) => !storyId.includes(skipId))) {
      return [...selectedStories, storyId];
    }
    return selectedStories;
  };
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
