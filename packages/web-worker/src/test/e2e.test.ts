/**
 * @jest-environment node
 */

import * as path from 'path';
import {DefinePlugin} from 'webpack';
import {Page, Worker, JSHandle} from 'puppeteer';

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

      await runWebpack(context, {
        webpackPlugin: new WebWorkerPlugin({
          plugins: [
            new DefinePlugin({
              [magicVar.id]: JSON.stringify(magicVar.value),
            }),
          ],
        }),
      });

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

    await withContext('automatic-retain-release', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          self.prepare = () => {
            start();

            // Store this on self so we can use it when we call the worker
            self.func = () => {};

            // Store this on self so we retain it and its function store,
            // which should lead to memory leaks if the function store is not cleaned.
            self.worker = createWorker(() => import('./worker'))();

            // Store this on self so we can get access to it to
            // count the non-GC'ed instances
            self.WorkerTestClass = class WorkerTestClass {constructor(id) {this.id = id;}}

            // Store this on self so we have a retained reference that
            // references both the function and an instance of the test class
            self.memoryTracker = new WeakMap();
            self.memoryTracker.set(self.func, new self.WorkerTestClass('foo'));

            done();
          }

          self.run = async () => {
            start();

            await self.worker.run(self.func);

            // Delete the reference so we no longer have any
            // direct retain paths to the function, allowing it
            // to be GC'ed (and, by extension, to be removed from the
            // memoryTracker WeakMap).
            delete self.func;

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

      await page.waitForSelector(`#${testId}`);

      await page.evaluate(() => (self as any).prepare());
      await page.waitForSelector(`#${testId}`);

      // One reference retained because we have a direct retainer
      // for the function (`self`).
      expect(await getTestClassInstanceCount(page)).toBe(1);

      await page.evaluate(() => (self as any).run());
      await page.waitForSelector(`#${testId}`);

      // Zero references because we took it off `self` and the
      // call to the worker is done, so its reference to the
      // function is automatically removed.
      expect(await getTestClassInstanceCount(page)).toBe(0);
    });
  });

  it('supports the two endpoints manually retaining functions passed through the bridge', async () => {
    const testId = 'WorkerResult';

    await withContext('manual-retain-release', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          // See previous test for details of these test utilities
          self.WorkerTestClass = class WorkerTestClass {}
          self.memoryTracker = new WeakMap();
          self.worker = createWorker(() => import('./worker'))();

          self.retain = async () => {
            start();

            const func = () => {};
            self.memoryTracker.set(func, new self.WorkerTestClass());
            await self.worker.retain(func);

            done();
          }

          self.release = async () => {
            start();
            await self.worker.release();
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

          self.memoryTracker = new WeakMap();
          self.WorkerTestClass = class WorkerTestClass {}

          export async function retain(func) {
            self.func = func;
            self.memoryTracker.set(func, new self.WorkerTestClass());
            retainRef(func);
          }

          export async function release() {
            const {func} = self;
            delete self.func;
            releaseRef(func);
          }
        `,
      );

      await runWebpack(context);

      const page = await browser.go();

      await page.waitForSelector(`#${testId}`);

      const [worker] = page.workers();

      await page.evaluate(() => (self as any).retain());
      await page.waitForSelector(`#${testId}`);

      // One reference retained because we have manually retained
      // the reference to the function in the worker (even
      // though the original worker call has exited, which
      // is what cleaned up the reference in the previous test
      // case).
      expect(await getTestClassInstanceCount(page)).toBe(1);
      expect(await getTestClassInstanceCount(worker)).toBe(1);

      await page.evaluate(() => (self as any).release());
      await page.waitForSelector(`#${testId}`);

      // Zero references because we manually released it (and,
      // in the case of the worker, removed our global `self`
      // reference to the function which was only used for
      // retrieving it in release())
      expect(await getTestClassInstanceCount(page)).toBe(0);
      expect(await getTestClassInstanceCount(worker)).toBe(0);
    });
  });

  it('calls into the module directly when not turned into a web worker', async () => {
    const greetingPrefix = 'Hello ';
    const greetingTarget = 'world';
    const testId = 'WorkerResult';

    await withContext('non-worker', async context => {
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

      await runWebpackBase(context, {
        entry: context.workspace.resolvePath(mainFile),
      });

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toBe(`${greetingPrefix}${greetingTarget}`);
      expect(page.workers()).toHaveLength(0);
    });
  });

  it('creates a noop worker that throws when called if the noop option is passed', async () => {
    const testId = 'WorkerResult';

    await withContext('noop', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker} from '@shopify/web-worker';

          const worker = createWorker(() => import('./worker'))();

          (async () => {
            const element = document.createElement('div');
            element.setAttribute('id', ${JSON.stringify(testId)});

            try {
              await worker.willThrow();
            } catch (error) {
              element.textContent = error.message;
            }

            document.body.appendChild(element);
          })();
        `,
      );

      await runWebpack(context, {
        babelPluginOptions: {noop: true},
      });

      const page = await browser.go();
      const workerElement = await page.waitForSelector(`#${testId}`);
      const textContent = await workerElement.evaluate(
        element => element.innerHTML,
      );

      expect(textContent).toMatch(/noop worker/i);
      expect(page.workers()).toHaveLength(0);
    });
  });

  it('throws an error when calling a function on a terminated worker', async () => {
    const greetingPrefix = 'Hello ';
    const greetingTarget = 'world';
    const testId = 'WorkerResult';

    await withContext('basic-result', async context => {
      const {workspace, browser} = context;

      await workspace.write(
        mainFile,
        `
          import {createWorker, terminate} from '@shopify/web-worker';
          self.worker = createWorker(() => import('./worker'))();
          (async () => {
            await terminate(self.worker);
            let result;
            try {
              result = await self.worker.greet(${JSON.stringify(
                greetingTarget,
              )});
            } catch (error){
              result = error.toString();
            }
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
      expect(textContent).toBe(
        'Error: You attempted to call a function on a terminated web worker.',
      );
    });
  });
});

function runWebpack(
  context: Context,
  {
    babelPluginOptions,
    webpackPlugin = new WebWorkerPlugin(),
  }: {webpackPlugin?: WebWorkerPlugin; babelPluginOptions?: object} = {},
) {
  return runWebpackBase(context, {
    entry: context.workspace.resolvePath(mainFile),
    plugins: [webpackPlugin],
    module: {
      rules: [
        {
          include: context.workspace.resolvePath(mainFile),
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: [[babelPlugin, babelPluginOptions]],
              },
            },
          ],
        },
      ],
    },
  });
}

async function getTestClassInstanceCount(source: Page | Worker) {
  let prototype: JSHandle | undefined;
  let instances: JSHandle | undefined;

  const context = (source as any).executionContext
    ? await (source as Worker).executionContext()
    : (source as Page);

  try {
    prototype = await context.evaluateHandle(
      () => (self as any).WorkerTestClass.prototype,
    );

    instances = await context.queryObjects(prototype);
    return context.evaluate(workers => workers.length, instances);
  } finally {
    if (prototype) {
      await prototype.dispose();
    }

    if (instances) {
      await instances.dispose();
    }
  }
}
