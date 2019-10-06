/**
 * @jest-environment node
 */

import * as path from 'path';
import {DefinePlugin} from 'webpack';

import {WebWorkerPlugin} from '../webpack-parts';
import {withContext, Context, runWebpack as runWebpackBase} from './utilities';

const babelPlugin = path.resolve(__dirname, '../babel-plugin.ts');
const mainFile = 'src/main.js';
const workerFile = 'src/worker.js';

jest.setTimeout(10_000);

describe('web-worker', () => {
  it('creates a worker factory that can produce workers that act like the original module', async () => {
    const greetingPrefix = 'Hello ';
    const greetingTarget = 'world';
    const testId = 'WorkerResult';

    await withContext('basic-result', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            const result = await worker.greet(${JSON.stringify(
              greetingTarget,
            )});
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = result;
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export function greet(name) {
            return \`${greetingPrefix}\${name}\`;
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toBe(`${greetingPrefix}${greetingTarget}`);
    });
  });

  it('creates a worker that propagates thrown errors', async () => {
    const errorMessage = 'Something went wrong!';
    const testId = 'WorkerResult';

    await withContext('thrown-error', async context => {
      const {workspace, browser, server} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            let content = '';

            try {
              await worker.blowUp();
              content = 'All clear!';
            } catch (error) {
              content = error.message + error.stack;
            }

            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = content;
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export function blowUp() {
            throw new Error(${JSON.stringify(errorMessage)});
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toContain(errorMessage);
      expect(textContent).toContain(server.assetUrl('worker.worker.js').href);
    });
  });

  it('supports using arbitrary webpack plugins on the worker build', async () => {
    const magicVar = {id: '__MAGIC_VAR__', value: 'It’s magic!'};
    const testId = 'WorkerResult';

    await withContext('webpack-plugins', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = await worker.magicVar();
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export function magicVar() {
            return ${magicVar.id};
          }
        `,
      );

      await runWebpack(
        context,
        new WebWorkerPlugin({
          plugins: [
            new DefinePlugin({
              [magicVar.id]: JSON.stringify(magicVar.value),
            }),
          ],
        }),
      );

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toBe(magicVar.value);
    });
  });

  it('automatically proxies functions passed from the parent to the worker', async () => {
    const nameOne = 'Gord';
    const nameTwo = 'Michelle';
    const testId = 'WorkerResult';

    await withContext('function-to-worker', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          const worker = createWorker(() => import('./worker'))();

          const users = [
            {getName: () => ${JSON.stringify(nameOne)}},
            {getName: () => ${JSON.stringify(nameTwo)}},
          ];

          (async () => {
            const result = await worker.greet(users);
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            element.textContent = result;
            document.body.appendChild(element);
          })();
        `,
      );

      await workspace.write(
        workerFile,
        `
          export async function greet(users) {
            const names = await Promise.all(
              users.map((user) => {
                return user.getName();
              })
            );

            return \`Hello, \${names.join(' and ')}\`;
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toBe(`Hello, ${nameOne} and ${nameTwo}`);
    });
  });

  it('automatically released references to functions after a call-stack is finished', async () => {
    const testId = 'WorkerResult';

    await withContext('automatic-release', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          window.prepare = () => {
            start();

            // Store this on window so we can use it when we call the worker
            window.func = () => {};

            // Store this on window so we retain it and its function store,
            // which should lead to memory leaks if the function store is not cleaned.
            window.worker = createWorker(() => import('./worker'))();

            // Store this on window so we can get access to it to
            // count the non-GC'ed instances
            window.WorkerTestClass = class WorkerTestClass {constructor(id) {this.id = id;}}

            // Store this on window so we have a retained reference that
            // references both the function and an instance of the test class
            window.memoryTracker = new WeakMap();
            window.memoryTracker.set(window.func, new window.WorkerTestClass('foo'));

            done();
          }

          window.run = async () => {
            start();

            await window.worker.run(window.func);

            // Delete the reference so we no longer have any
            // direct retain paths to the function, allowing it
            // to be GC'ed (and, by extension, to be removed from the
            // memoryTracker WeakMap).
            delete window.func;

            done();
          };

          done();

          function start() {
            for (const node of document.querySelectorAll('#' + ${JSON.stringify(
              testId,
            )})) {
              node.remove();
            }
          }

          function done() {
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            document.body.appendChild(element);
          }
        `,
      );

      await workspace.write(
        workerFile,
        `
          export async function run(func) {
            return func();
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();

      async function getTestClassInstanceCount() {
        let prototype: import('puppeteer').JSHandle | undefined;
        let instances: import('puppeteer').JSHandle | undefined;

        try {
          prototype = await page.evaluateHandle(
            () => (window as any).WorkerTestClass.prototype,
          );

          instances = await page.queryObjects(prototype);
          return page.evaluate(workers => workers.length, instances);
        } finally {
          if (prototype) {
            await prototype.dispose();
          }

          if (instances) {
            await instances.dispose();
          }
        }
      }

      await page.waitForSelector(`#${testId}`);

      await page.evaluate(() => (window as any).prepare());
      await page.waitForSelector(`#${testId}`);

      // One reference retained because we have a direct retainer
      // for the function (window)
      expect(await getTestClassInstanceCount()).toBe(1);

      await page.evaluate(() => (window as any).run());
      await page.waitForSelector(`#${testId}`);

      // Zero references because we took it off window and, even
      // though we passed it over the worker, we have since
      // collected its memory.
      expect(await getTestClassInstanceCount()).toBe(0);
    });
  });

  it('supports the two endpoints manually retaining functions passed through the bridge', async () => {
    const testId = 'WorkerResult';

    await withContext('automatic-release', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          // Store this on window so we can get access to it to
          // count the non-GC'ed instances
          window.WorkerTestClass = class WorkerTestClass {constructor(id) {this.id = id;}}

          // Store this on window so we have a retained reference that
          // references both the function and an instance of the test class
          window.memoryTracker = new WeakMap();

          // Store this on window so we retain it and its function store,
          // which should lead to memory leaks if the function store is not cleaned.
          window.worker = createWorker(() => import('./worker'))();

          window.retain = async () => {
            start();

            const func = () => {};
            window.memoryTracker.set(func, new window.WorkerTestClass('foo'));
            await window.worker.retain(func);

            done();
          }

          window.release = async () => {
            start();
            await window.worker.release();
            done();
          };

          done();

          function start() {
            for (const node of document.querySelectorAll('#' + ${JSON.stringify(
              testId,
            )})) {
              node.remove();
            }
          }

          function done() {
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});
            document.body.appendChild(element);
          }
        `,
      );

      await workspace.write(
        workerFile,
        `
          import {retain as retainRef, release as releaseRef} from '@shopify/web-worker';

          const ref = {};

          export async function retain(func) {
            ref.current = func;
            retainRef(func);
          }

          export async function release() {
            const {current: func} = ref;
            delete ref.current;
            releaseRef(func);
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();

      async function getTestClassInstanceCount() {
        let prototype: import('puppeteer').JSHandle | undefined;
        let instances: import('puppeteer').JSHandle | undefined;

        try {
          prototype = await page.evaluateHandle(
            () => (window as any).WorkerTestClass.prototype,
          );

          instances = await page.queryObjects(prototype);
          return page.evaluate(workers => workers.length, instances);
        } finally {
          if (prototype) {
            await prototype.dispose();
          }

          if (instances) {
            await instances.dispose();
          }
        }
      }

      await page.waitForSelector(`#${testId}`);

      await page.evaluate(() => (window as any).retain());
      await page.waitForSelector(`#${testId}`);

      // One reference retained because we have a direct retainer
      // for the function (window)
      expect(await getTestClassInstanceCount()).toBe(1);

      await page.evaluate(() => (window as any).release());
      await page.waitForSelector(`#${testId}`);

      // Zero references because we took it off window and, even
      // though we passed it over the worker, we have since
      // collected its memory.
      expect(await getTestClassInstanceCount()).toBe(0);
    });
  });
});

function runWebpack(context: Context, plugin = new WebWorkerPlugin()) {
  return runWebpackBase(context, {
    entry: context.workspace.resolvePath(mainFile),
    plugins: [plugin],
    module: {
      rules: [
        {
          include: context.workspace.resolvePath(mainFile),
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: [babelPlugin],
              },
            },
          ],
        },
      ],
    },
  });
}
