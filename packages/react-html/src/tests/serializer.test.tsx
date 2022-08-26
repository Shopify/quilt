import React from 'react';
import {extract} from '@shopify/react-effect/server';
import {createMount} from '@shopify/react-testing';

import {render, Html} from '../server';
import {useSerialized, HtmlContext, HtmlManager} from '..';

describe('useSerialized', () => {
  it('serializes promise results', async () => {
    function MockComponent() {
      const [foo, Serialize] = useSerialized('foo');
      return <Serialize data={() => foo || Promise.resolve('foo_value')} />;
    }

    const manager = new HtmlManager();
    const app = <MockComponent />;
    await extract(app, {
      decorate: (element) => (
        <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
      ),
    });

    expect(render(<Html manager={manager}>{app}</Html>)).toContain(
      `<script type="text/json" data-serialized-id="foo">"foo_value"</script>`,
    );
  });

  it('gets the latest serialization value on re-render', () => {
    const key = 'serialized-key';
    const defaultValue = 'default-value';

    function MockComponent() {
      const [value] = useSerialized<string>(key);
      return <div>{value || defaultValue}</div>;
    }

    const manager = new HtmlManager();

    const mount = createMount({
      render: (element) => (
        <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
      ),
    });

    const wrapper = mount(<MockComponent />);

    expect(manager.getSerialization(key)).toBeUndefined();
    expect(wrapper.text()).toBe(defaultValue);

    const newValue = 'new-value';
    manager.setSerialization(key, newValue);
    // forces re-render
    wrapper.setProps({bar: true});

    expect(manager.getSerialization(key)).toBe(newValue);

    expect(wrapper.text()).toBe(newValue);
  });
});
