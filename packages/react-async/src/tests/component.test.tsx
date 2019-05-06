// Enzyme doesn't know how to handle components that only return fragments.
import * as React from 'react';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';
import {DeferTiming} from '@shopify/async';

import {Async} from '../Async';
import {createAsyncComponent} from '../component';

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
    ).toStrictEqual(<MockComponent {...props} />);
  });

  it('creates a deferred <Async /> when specified', () => {
    const load = () => Promise.resolve(MockComponent);
    const defer = DeferTiming.Idle;

    const AsyncComponent = createAsyncComponent({load, defer});
    const asyncComponent = mount(<AsyncComponent />);
    expect(asyncComponent.find(Async)).toHaveProp('defer', defer);
  });

  it('allows passing custom async props', () => {
    const load = () => Promise.resolve(MockComponent);
    const async = {defer: DeferTiming.Idle, renderLoading: () => <div />};

    const AsyncComponent = createAsyncComponent({load});
    const asyncComponent = mount(<AsyncComponent async={async} />);
    expect(asyncComponent.find(Async).props()).toMatchObject(async);
  });

  describe('<Preload />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const preload = mount(<AsyncComponent.Preload />);
      expect(preload).toContainReact(
        <Async defer={DeferTiming.Idle} load={load} />,
      );
    });

    it('renders the result of calling renderPreload()', () => {
      function Preload() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPreload = () => <Preload />;
      const AsyncComponent = createAsyncComponent({load, renderPreload});

      const preload = mount(
        <div>
          <AsyncComponent.Preload />
        </div>,
      );
      expect(preload).toContainReact(<Preload />);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const async = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const preload = mount(<AsyncComponent.Preload async={async} />);
      expect(preload.find(Async).props()).toMatchObject(async);
    });
  });

  describe('<Prefetch />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch />);
      expect(prefetch).toContainReact(
        <Async defer={DeferTiming.Mount} load={load} />,
      );
    });

    it('renders the result of calling renderPrefetch()', () => {
      function Prefetch() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderPrefetch = () => <Prefetch />;
      const AsyncComponent = createAsyncComponent({load, renderPrefetch});

      const prefetch = mount(
        <div>
          <AsyncComponent.Prefetch />
        </div>,
      );
      expect(prefetch).toContainReact(<Prefetch />);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const async = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch async={async} />);
      expect(prefetch.find(Async).props()).toMatchObject(async);
    });
  });

  describe('<KeepFresh />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(MockComponent);
      const AsyncComponent = createAsyncComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh />);
      expect(keepFresh).toContainReact(
        <Async defer={DeferTiming.Idle} load={load} />,
      );
    });

    it('renders the result of calling renderKeepFresh()', () => {
      function KeepFresh() {
        return null;
      }

      const load = () => Promise.resolve(MockComponent);
      const renderKeepFresh = () => <KeepFresh />;
      const AsyncComponent = createAsyncComponent({load, renderKeepFresh});

      const keepFresh = mount(
        // Enzyme doesn't know how to handle components that only return fragments.
        <div>
          <AsyncComponent.KeepFresh />
        </div>,
      );
      expect(keepFresh).toContainReact(<KeepFresh />);
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(MockComponent);
      const async = {defer: undefined, renderLoading: () => <div />};

      const AsyncComponent = createAsyncComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh async={async} />);
      expect(keepFresh.find(Async).props()).toMatchObject(async);
    });
  });
});
