import * as React from 'react';
import {FirstArgument} from '@shopify/useful-types';

import {Root} from '../root';
import {Element} from '../element';
import {Tag} from '../types';
import {destroyAll} from '../api';

jest.mock('react-dom/test-utils', () => ({
  act: jest.fn((callback: Function) => callback()),
}));

const {act} = require.requireMock('react-dom/test-utils') as {act: jest.Mock};

describe('Root', () => {
  afterEach(() => {
    destroyAll();
    act.mockReset();
    act.mockImplementation((callback: Function) => callback());
  });

  it('delegates calls to the root element', () => {
    const root = new Root(<div />);

    const childInstance = document.createElement('div');
    childInstance.textContent = 'Child';
    const childElement = new Element(
      {
        type: 'div',
        tag: Tag.HostComponent,
        props: {},
        instance: childInstance,
      },
      [],
      [],
      root,
    );

    const instance = document.createElement('div');
    instance.textContent = 'Hello world!';
    const element = new Element(
      {
        type: 'div',
        tag: Tag.HostComponent,
        props: {
          'aria-label': 'Hello',
          onClick: (name: string) => `Nicely done, ${name}!`,
        },
        instance,
      },
      [childElement],
      [childElement],
      root,
    );

    // Yes, in general it is very bad practice to mock a private method like this.
    // Unfortunately, not doing this means we need to mock out a big chunk
    // of the module system instead, which isn't really any better.
    jest
      .spyOn(root, 'withRoot' as any)
      .mockImplementation((withRoot: (element: Element<any>) => any) =>
        withRoot(element),
      );

    expect(root.props).toBe(element.props);
    expect(root.instance).toBe(element.instance);
    expect(root.isDOM).toBe(element.isDOM);
    expect(root.children).toBe(element.children);
    expect(root.descendants).toBe(element.descendants);
    expect(root.domNode).toBe(element.domNode);
    expect(root.domNodes).toEqual(element.domNodes);
    expect(root.html()).toBe(element.html());
    expect(root.text()).toBe(element.text());
    expect(root.is('div')).toBe(element.is('div'));
    expect(root.prop('aria-label')).toBe(element.prop('aria-label'));
    expect(root.find('div')).toBe(element.find('div'));
    expect(root.findAll('div')).toEqual(element.findAll('div'));
    expect(root.findWhere(element => element.type === 'div')).toBe(
      element.findWhere(element => element.type === 'div'),
    );
    expect(root.findAllWhere(element => element.type === 'div')).toEqual(
      element.findAllWhere(element => element.type === 'div'),
    );
    expect(root.trigger('onClick', 'Gord')).toEqual(
      element.trigger('onClick', 'Gord'),
    );
    expect(root.triggerKeypath('onClick', 'Gord')).toEqual(
      element.triggerKeypath('onClick', 'Gord'),
    );
  });

  it('throws an error when attempting to delegate to an unmounted root', () => {
    const root = new Root(<div />);
    root.unmount();
    expect(() => root.html()).toThrowError(
      /Attempted to operate on a mounted tree, but the component is no longer mounted/,
    );
  });

  describe('#unmount', () => {
    it('leaves the host DOM node in the DOM', () => {
      const root = new Root(<div>Hello world</div>);
      root.unmount();
      expect(document.body.firstElementChild).toBeInstanceOf(HTMLDivElement);
    });

    it('unmounts the component from the DOM', () => {
      const root = new Root(<div>Hello world</div>);
      root.unmount();
      expect(document.body.firstElementChild!.innerHTML).toBe('');
    });

    it('throws an error if the component is already unmounted', () => {
      const root = new Root(<div>Hello world</div>);
      root.unmount();
      expect(() => root.unmount()).toThrowError(
        /You attempted to unmount a node that was already unmounted/,
      );
    });
  });

  describe('#destroy', () => {
    it('removes the host DOM node in the DOM', () => {
      const root = new Root(<div>Hello world</div>);
      root.destroy();
      expect(document.body.firstElementChild).toBeNull();
    });
  });

  describe('#mount()', () => {
    it('attaches a host div to the DOM', () => {
      // eslint-disable-next-line no-new
      new Root(<div>Hello world</div>);
      expect(document.body.firstElementChild!).toBeInstanceOf(HTMLDivElement);
    });

    it('is called in the constructor to mount the element to a DOM node', () => {
      // eslint-disable-next-line no-new
      new Root(<div>Hello world</div>);
      expect(document.body.firstElementChild!.innerHTML).toBe(
        '<div>Hello world</div>',
      );
    });

    it('throws an error when the component is already mounted', () => {
      const root = new Root(<div>Hello world</div>);
      expect(() => root.mount()).toThrowError(
        /Attempted to mount a node that was already mounted/,
      );
    });

    it('re-mountes an unmounted component', () => {
      const root = new Root(<div>Hello world</div>);

      root.unmount();
      root.mount();
      expect(document.body.firstElementChild!.innerHTML).toBe(
        '<div>Hello world</div>',
      );
    });
  });

  describe('#setProps()', () => {
    it('updates the props on the root node', () => {
      function MyComponent(_props: {name: string}) {
        return null;
      }

      const root = new Root(<MyComponent name="Gord" />);
      expect(root.prop('name')).toBe('Gord');

      root.setProps({name: 'goodforonefare'});
      expect(root.prop('name')).toBe('goodforonefare');
    });

    it('does not unmount the component, but does trigger an update', () => {
      const componentWillUnmount = jest.fn();
      const componentDidUpdate = jest.fn();
      class MyComponent extends React.Component<{name: string}> {
        componentWillUnmount = componentWillUnmount;
        componentDidUpdate = componentDidUpdate;

        render() {
          return null;
        }
      }

      const root = new Root(<MyComponent name="Chris" />);
      root.setProps({name: 'lemonmade'});

      expect(componentWillUnmount).not.toHaveBeenCalled();
      expect(componentDidUpdate).toHaveBeenCalled();
    });
  });

  describe('#act()', () => {
    it('runs the callback in an act block', () => {
      const root = new Root(<div />);

      const queue = new Set<FirstArgument<Root<any>['act']>>();
      act.mockImplementation((action: FirstArgument<Root<any>['act']>) =>
        queue.add(action),
      );

      const action = jest.fn();

      root.act(action);
      expect(action).not.toHaveBeenCalled();

      for (const queued of queue) {
        queued();
      }

      expect(action).toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    const Thrower: React.ComponentType = () => {
      throw new Error('Something bad happened');
    };

    it('throws an error when a mounted component throws an error', () => {
      expect(() => new Root(<Thrower />)).toThrowError(
        'Something bad happened',
      );
    });

    it('throws an error when updating to a component that throws an error', () => {
      function MyComponent() {
        const [renderThrower, setRenderThrower] = React.useState(false);

        return renderThrower ? (
          <Thrower />
        ) : (
          <button type="button" onClick={() => setRenderThrower(true)} />
        );
      }

      const root = new Root(<MyComponent />);

      expect(() =>
        root.find('button')!.trigger('onClick', {} as any),
      ).toThrowError('Something bad happened');
    });
  });
});
