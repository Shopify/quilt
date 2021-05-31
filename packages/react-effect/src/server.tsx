import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {EffectContext} from './context';
import {EffectManager} from './manager';
import {Pass} from './types';

export {Effect} from './Effect';

interface Options {
  include?: symbol[] | boolean;
  maxPasses?: number;
  decorate?(element: React.ReactElement<any>): React.ReactElement<any>;
  renderFunction?(element: React.ReactElement<{}>): string;
  betweenEachPass?(pass: Pass): any;
  afterEachPass?(pass: Pass): any;
}

const DEFAULT_MAX_PASSES = 5;

export function extract(
  app: React.ReactElement<any>,
  {
    include,
    maxPasses = DEFAULT_MAX_PASSES,
    decorate = identity,
    renderFunction = renderToStaticMarkup,
    betweenEachPass,
    afterEachPass,
  }: Options = {},
) {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const manager = new EffectManager({include});
  const element = (
    <EffectContext.Provider value={manager}>
      {decorate(app)}
    </EffectContext.Provider>
  );

  return (async function perform(index = 0): Promise<string> {
    const start = Date.now();
    const result = renderFunction(element);
    const cancelled = !manager.finished && index + 1 >= maxPasses;

    if (manager.finished || cancelled) {
      const duration = Date.now() - start;

      await manager.afterEachPass({
        index,
        finished: true,
        cancelled,
        renderDuration: duration,
        resolveDuration: 0,
      });

      if (afterEachPass) {
        await afterEachPass({
          index,
          finished: true,
          cancelled,
          renderDuration: duration,
          resolveDuration: 0,
        });
      }

      return result;
    } else {
      const resolveStart = Date.now();
      const renderDuration = resolveStart - start;

      await manager.resolve();

      const resolveDuration = Date.now() - resolveStart;
      let performNextPass = true;

      performNextPass =
        shouldContinue(
          await manager.afterEachPass({
            index,
            finished: false,
            cancelled: false,
            renderDuration,
            resolveDuration,
          }),
        ) && performNextPass;

      if (afterEachPass) {
        performNextPass =
          shouldContinue(
            await afterEachPass({
              index,
              finished: false,
              cancelled: false,
              renderDuration,
              resolveDuration,
            }),
          ) && performNextPass;
      }

      if (performNextPass) {
        await manager.betweenEachPass({
          index,
          finished: false,
          cancelled: false,
          renderDuration,
          resolveDuration,
        });

        if (betweenEachPass) {
          await betweenEachPass({
            index,
            finished: false,
            cancelled: false,
            renderDuration,
            resolveDuration,
          });
        }
      }

      manager.reset();

      return performNextPass ? perform(index + 1) : result;
    }
  })();
}

function shouldContinue(result: unknown) {
  return result !== false;
}

function identity<T>(value: T): T {
  return value;
}
