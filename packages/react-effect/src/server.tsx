import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {EffectContext, EffectManager} from './context';

interface Options {
  include?: symbol[] | boolean;
  decorate?(element: React.ReactElement<any>): React.ReactElement<any>;
  renderFunction?(element: React.ReactElement<{}>): string;
  betweenEachPass?(): any;
  afterEachPass?(): any;
}

export function extract(
  app: React.ReactElement<any>,
  {
    include,
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

  return (async function perform(): Promise<string> {
    const result = renderFunction(element);

    if (manager.finished) {
      await manager.afterEachPass();
      if (afterEachPass) {
        await afterEachPass();
      }

      return result;
    } else {
      await manager.resolve();

      await manager.betweenEachPass();
      if (betweenEachPass) {
        await betweenEachPass();
      }

      await manager.afterEachPass();
      if (afterEachPass) {
        await afterEachPass();
      }

      return perform();
    }
  })();
}

function identity<T>(value: T): T {
  return value;
}
