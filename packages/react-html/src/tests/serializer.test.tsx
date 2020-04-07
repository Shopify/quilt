import React from 'react';
import {extract} from '@shopify/react-effect/server';

import {render, Html} from '../server';

import {useSerialized, HtmlContext, HtmlManager} from '..';

describe('useSerialized', () => {
  it('serializes promise results', async () => {
    function MockComponent() {
      const [, Serialize] = useSerialized('foo');
      return <Serialize data={() => Promise.resolve({result: 'foo_value'})} />;
    }

    const manager = new HtmlManager();
    const app = <MockComponent />;
    await extract(app, {
      decorate: element => (
        <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
      ),
    });

    expect(render(<Html manager={manager}>{app}</Html>)).toContain(
      `<script type="text/json" data-serialized-id="foo">{"data":{"result":"foo_value"}}</script>`,
    );
  });

  it('serializes string values with data wrapper', async () => {
    function MockComponent() {
      const [, Serialize] = useSerialized('foo');
      return <Serialize data={() => 'my-value'} />;
    }

    const manager = new HtmlManager();
    const app = <MockComponent />;
    await extract(app, {
      decorate: element => (
        <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
      ),
    });

    expect(render(<Html manager={manager}>{app}</Html>)).toContain(
      `<script type="text/json" data-serialized-id="foo">{"data":"my-value"}</script>`,
    );
  });
});
