/* eslint-disable no-console */
import os from 'os';

import puppeteer, {Browser} from 'puppeteer';
import pMap from 'p-map';
import chalk from 'chalk';
import Koa from 'koa';
import serve from 'koa-static';

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
    __STORYBOOK_STORY_STORE__: StoryStore<any>;
  }
}

const FORMATTING_SPACER = '    ';

export class A11yTestRunner {
  #browser: Browser | undefined;

  buildDir: string;
  app: Koa;
  iframePath: string;
  server: ReturnType<Koa['listen']>;

  constructor(buildDir: string) {
    this.buildDir = buildDir;
    this.app = new Koa();
    this.app.use(serve(buildDir));
    this.server = this.app.listen();
    const address = this.server.address();

    if (!address || typeof address === 'string') {
      throw new Error('Unable to start local server');
    }

    this.iframePath = `http://127.0.0.1:${address.port}/iframe.html`;
  }

  async testPages({
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
    console.log(
      chalk.bold(
        `🌐 Opening ${Math.min(
          concurrentCount,
          storyIds.length,
        )} tabs in Chromium`,
      ),
    );
    console.log(chalk.bold(`🧪 Testing ${storyIds.length} urls with axe`));
    const results = await pMap(
      storyIds,
      this.generateTestStoryFunction(timeout, disableAnimation),
      {
        concurrency: concurrentCount,
      },
    );
    return results.filter(Boolean);
  }

  async collectStoryIdsFromStoriesJSON() {
    const storiesJSON = require(`${this.buildDir}/stories.json`);
    return Object.keys(storiesJSON.stories);
  }

  async collectEnabledStoryIdsFromIFrame() {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(this.iframePath);

    await page.evaluate(async () => {
      if (
        typeof window.__STORYBOOK_STORY_STORE__.cacheAllCSFFiles === 'function'
      ) {
        await window.__STORYBOOK_STORY_STORE__.cacheAllCSFFiles();
      }
    });

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

    await page.close();

    return storyIds.filter((storyId) => !disabledStoryIds.includes(storyId));
  }

  async teardown() {
    if (this.#browser && this.#browser.isConnected) {
      await this.#browser.close();
    }
    if (this.server.listening) {
      this.server.close();
    }
  }

  private async getBrowser() {
    if (!this.#browser) {
      this.#browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.#browser;
  }

  private generateTestStoryFunction(
    timeout: number,
    disableAnimation: boolean,
  ) {
    return async (id: StoryId) => {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      await page.goto(`${this.iframePath}?id=${id}`, {
        waitUntil: 'load',
        timeout,
      });

      const parameters =
        (await page.evaluate(async (storyId) => {
          if (
            typeof window.__STORYBOOK_STORY_STORE__.loadStory === 'function'
          ) {
            const story = await window.__STORYBOOK_STORY_STORE__.loadStory({
              storyId,
            })!;
            return story.parameters;
          } else {
            const story = window.__STORYBOOK_STORY_STORE__.fromId(storyId)!;
            return story.parameters;
          }
        }, id)) || {};

      if (parameters.a11y?.disable) {
        console.log(` - ${id}: Skipped (a11y.disable)`);
        return null;
      } else {
        console.log(` - ${id}`);
      }

      const config = parameters.config ?? {};
      const options = parameters.options ?? {restoreScrool: true};

      try {
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

        if (results.violations && results.violations.length) {
          const filteredViolations = results.violations.filter(
            (violation) => !isAutocompleteNope(violation),
          );

          return formatMessage(id, filteredViolations);
        }

        return null;
      } catch (error) {
        return `please retry => ${id}:\n - ${error.message}`;
      } finally {
        await page.close();
      }
    };
  }
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
