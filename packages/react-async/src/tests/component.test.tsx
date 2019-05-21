import React from 'react';
import {mount} from '@shopify/react-testing';
import {DeferTiming} from '@shopify/async';

import {Async} from '../Async';
import {createAsyncComponent} from '../component';
import {PreloadPriority} from '../shared';

jest.mock('../Async', () => ({
  Async() {
    return null;
  },
}));

function MockComponent({name = 'Tobi'}: {name?: string}) {
  return <>Hello, {name}</>;
}

describe('createAsyncComponent()', () => {
  it('creates a component that mounts an <Async />', () => {
    const load = () => Promise.resolve(MockComponent);
    const id = () => 'foo';
    const renderLoading = () => null;

    const AsyncComponent = createAsyncComponent({load, id, renderLoading});
    const asyncComponent = mount(<AsyncComponent />);
    expect(asyncComponent).toContainReactComponent(Async, {
      load,
      id,
      renderLoading,
      preloadPriority: PreloadPriority.CurrentPage,
    });
  });

  it('renders the component when available, and returns null otherwise', () => {
    const load = () => Promise.resolve(MockComponent);
    const props = {name: 'Mal'};
    const AsyncComponent = createAsyncComponent({load});
    const asyncComponent = mount(<AsyncComponent {...props} />);

    expect(asyncComponent.find(Async)!.trigger('render', null)).toBeNull();
    expect(
      asyncComponent.find(Async)!.trigger('render', MockComponent),
    ).toMatchObject(<MockComponent {...props} />);
  });

  it('creates a deferred <Async /> when specified', () => {
    const load = () => Promise.resolve(MockComponent);
    const defer = DeferTiming.Idle;

    const AsyncComponent = createAsyncComponent({load, defer});
    const asyncComponent = mount(<AsyncComponent />);
    expect(asyncComponent).toContainReactComponent(Async, {defer});
  });

  it('allows passing custom async props', () => {
    const load = () => Promise.resolve(MockComponent);
    const asyncProps = {defer: DeferTiming.Idle, renderLoading: () => <div />};

    const AsyncComponent = createAsyncComponent({load});
    const asyncComponent = mount(<AsyncComponent async={asyncProps} />);
    expect(asyncComponent).toContainReactComponent(Async, asyncProps);
  });

  describe('<Preload />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const preload = mount(<AsyncComponent.Preload />);
      expect(preload).toContainReactComponent(Async, {
        load,
        defer: DeferTiming.Idle,
        preloadPriority: PreloadPriority.NextPage,
      });
    });

    it('renders the result of calling renderPreload()', () => {
      function Preload() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPreload = () => <Preload />;
      const AsyncComponent = createAsyncComponent({load, renderPreload});

      const preload = mount(<AsyncComponent.Preload />);
      expect(preload).toContainReactComponent(Preload);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const async = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const preload = mount(<AsyncComponent.Preload async={async} />);
      expect(preload).toContainReactComponent(Async, async);
    });
  });

  describe('<Prefetch />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch />);
      expect(prefetch).toContainReactComponent(Async, {
        load,
        defer: DeferTiming.Mount,
        preloadPriority: PreloadPriority.NextPage,
      });
    });

    it('renders the result of calling renderPrefetch()', () => {
      function Prefetch() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPrefetch = () => <Prefetch />;
      const AsyncComponent = createAsyncComponent({load, renderPrefetch});

      const prefetch = mount(<AsyncComponent.Prefetch />);
      expect(prefetch).toContainReactComponent(Prefetch);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const asyncProps = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch async={asyncProps} />);
      expect(prefetch).toContainReactComponent(Async, asyncProps);
    });
  });

  describe('<KeepFresh />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh />);
      expect(keepFresh).toContainReactComponent(Async, {
        load,
        defer: DeferTiming.Idle,
        preloadPriority: PreloadPriority.NextPage,
      });
    });

    it('renders the result of calling renderKeepFresh()', () => {
      function KeepFresh() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderKeepFresh = () => <KeepFresh />;
      const AsyncComponent = createAsyncComponent({load, renderKeepFresh});

      const keepFresh = mount(<AsyncComponent.KeepFresh />);
      expect(keepFresh).toContainReactComponent(KeepFresh);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const asyncProps = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh async={asyncProps} />);
      expect(keepFresh).toContainReactComponent(Async, asyncProps);
    });
  });
});
