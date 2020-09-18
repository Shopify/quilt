/**
 * @jest-environment node
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {usePerformanceEffect, PerformanceEffectCallback} from '..';

describe('usePerformanceEffect', () => {
  function TestComponent({callback}: {callback: PerformanceEffectCallback}) {
    usePerformanceEffect(callback);
    return <div>nothing of note ;P</div>;
  }

  it('does not call the given callback when there is no Performance in context on the server', () => {
    const spy = jest.fn();
    ReactDOMServer.renderToStaticMarkup(<TestComponent callback={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });
});
