import * as React from 'react';
import {extract} from '@shopify/react-effect/server';
import {useSerialized, HtmlContext, HtmlManager} from '..';
import {render, Html} from '../server';

describe('useSerialized', () => {
  it('serializes promise results', async () => {
    function MockComponent() {
      const [foo, Serialize] = useSerialized('foo');
      return <Serialize data={() => foo || Promise.resolve('foo_value')} />;
    }

    const manager = new HtmlManager({isServer: true});
    const app = <MockComponent />;
    await extract(app, {
      decorate: element => (
        <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
      ),
    });

    expect(render(<Html manager={manager}>{app}</Html>)).toContain(
      `<script type="text/json" data-serialized-id="foo">"foo_value"</script>`,
    );
  });
});
