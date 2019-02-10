import * as React from 'react';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';

import {Async} from '../Async';
import {createAsyncComponent} from '../component';

jest.mock('../Async', () => ({
  Async() {
    return null;
  },
}));

function MockComponent({name = 'Tobi'}: {name?: string}) {
  return <div>Hello, {name}</div>;
}

describe('createAsyncComponent()', () => {
  it('creates a component that mounts an <Async />', () => {
    const load = () => Promise.resolve(MockComponent);
    const id = () => 'foo';
    const renderLoading = () => null;

    const AsyncComponent = createAsyncComponent({load, id, renderLoading});
    const asyncComponent = mount(<AsyncComponent />);
    expect(asyncComponent.find(Async).props()).toMatchObject({
      load,
      id,
      renderLoading,
    });
  });

  it('renders the component when available, and returns null otherwise', () => {
    const load = () => Promise.resolve(MockComponent);
    const props = {name: 'Mal'};
    const AsyncComponent = createAsyncComponent({load});
    const asyncComponent = mount(<AsyncComponent {...props} />);

    expect(trigger(asyncComponent.find(Async), 'render', null)).toBeNull();
    expect(
      trigger(asyncComponent.find(Async), 'render', MockComponent),
    ).toEqual(<MockComponent {...props} />);
  });

  describe('<Preload />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const preload = mount(<AsyncComponent.Preload />);
      expect(preload).toContainReact(<Async defer load={load} />);
    });

    it('renders the result of calling renderPreload()', () => {
      function Preload() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPreload = () => <Preload />;
      const AsyncComponent = createAsyncComponent({load, renderPreload});

      // Enzyme doesn't know how to handle components that only return fragments.
      const preload = mount(
        <div>
          <AsyncComponent.Preload />
        </div>,
      );
      expect(preload).toContainReact(<Preload />);
    });
  });

  describe('<Prefetch />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch />);
      expect(prefetch).toContainReact(<Async defer load={load} />);
    });

    it('renders the result of calling renderPrefetch()', () => {
      function Prefetch() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPrefetch = () => <Prefetch />;
      const AsyncComponent = createAsyncComponent({load, renderPrefetch});

      // Enzyme doesn't know how to handle components that only return fragments.
      const prefetch = mount(
        <div>
          <AsyncComponent.Prefetch />
        </div>,
      );
      expect(prefetch).toContainReact(<Prefetch />);
    });
  });

  describe('<KeepFresh />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh />);
      expect(keepFresh).toContainReact(<Async defer load={load} />);
    });

    it('renders the result of calling renderKeepFresh()', () => {
      function KeepFresh() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderKeepFresh = () => <KeepFresh />;
      const AsyncComponent = createAsyncComponent({load, renderKeepFresh});

      // Enzyme doesn't know how to handle components that only return fragments.
      const keepFresh = mount(
        <div>
          <AsyncComponent.KeepFresh />
        </div>,
      );
      expect(keepFresh).toContainReact(<KeepFresh />);
    });
  });
});
