import * as React from 'react';
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
  const manager = new EffectManager({include});
  const element = (
    <EffectContext.Provider value={manager}>
      {decorate(app)}
    </EffectContext.Provider>
  );

  return (async function perform(index = 0): Promise<string> {
    const start = Date.now();
    const result = renderFunction(element);

    if (manager.finished) {
      const duration = Date.now() - start;

      await manager.afterEachPass({
        index,
        finished: manager.finished,
        renderDuration: duration,
        resolveDuration: 0,
      });

      if (afterEachPass) {
        await afterEachPass({
          index,
          finished: manager.finished,
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

      await manager.betweenEachPass({
        index,
        finished: false,
        renderDuration,
        resolveDuration,
      });

      if (betweenEachPass) {
        await betweenEachPass({
          index,
          finished: false,
          renderDuration,
          resolveDuration,
        });
      }

      await manager.afterEachPass({
        index,
        finished: false,
        renderDuration,
        resolveDuration,
      });

      if (afterEachPass) {
        await afterEachPass({
          index,
          finished: false,
          renderDuration,
          resolveDuration,
        });
      }

      if (index + 1 >= maxPasses) {
        return result;
      }

      return perform(index + 1);
    }
  })();
}

function identity<T>(value: T): T {
  return value;
}
