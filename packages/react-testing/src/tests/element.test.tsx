import React from 'react';

import {Element} from '../element';
import {Root} from '../root';
import {Tag} from '../types';

function DummyComponent() {
  return null;
}

const defaultTree = {
  tag: Tag.FunctionComponent,
  type: DummyComponent,
  props: {},
};

const defaultRoot = new Root(<DummyComponent />);
const divTwo = new Element(
  {
    ...defaultTree,
    type: 'div',
    tag: Tag.HostComponent,
    instance: document.createElement('div'),
  },
  [],
  defaultRoot,
);

const divOne = new Element(
  {
    ...defaultTree,
    type: 'div',
    tag: Tag.HostComponent,
    instance: document.createElement('div'),
  },
  [divTwo],
  defaultRoot,
);

const componentTwo = new Element(
  {...defaultTree, type: DummyComponent},
  [],
  defaultRoot,
);

const componentOne = new Element(
  {...defaultTree, type: DummyComponent},
  [divOne, componentTwo],
  defaultRoot,
);

describe('Element', () => {
  describe('#props', () => {
    it('returns the props from the tree', () => {
      const props = {foo: 'bar'};
      const element = new Element({...defaultTree, props}, [], defaultRoot);
      expect(element).toHaveProperty('props', props);
    });
  });

  describe('#type', () => {
    it('returns the type from the tree', () => {
      const type = DummyComponent;
      const element = new Element({...defaultTree, type}, [], defaultRoot);
      expect(element).toHaveProperty('type', type);
    });
  });

  describe('#instance', () => {
    it('returns the type from the tree', () => {
      const instance = {};
      const element = new Element({...defaultTree, instance}, [], defaultRoot);
      expect(element).toHaveProperty('instance', instance);
    });
  });

  describe('#isDOM', () => {
    it('is false for non-host components', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.MemoComponent},
        [],
        defaultRoot,
      );
      expect(element).toHaveProperty('isDOM', false);
    });

    it('is true for host components', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.HostComponent},
        [],
        defaultRoot,
      );
      expect(element).toHaveProperty('isDOM', true);
    });
  });

  describe('#children', () => {
    it('returns element children', () => {
      const element = new Element(defaultTree, [divOne, divTwo], defaultRoot);

      expect(element).toHaveProperty('children', [divOne, divTwo]);
    });

    it('does not return string children', () => {
      const element = new Element(
        defaultTree,
        [divOne, 'Some text', divTwo],
        defaultRoot,
      );

      expect(element).toHaveProperty('children', [divOne, divTwo]);
    });
  });

  describe('#descendants', () => {
    it('returns element descendants', () => {
      const element = new Element(defaultTree, [divOne], defaultRoot);

      expect(element).toHaveProperty('descendants', [divOne, divTwo]);
    });
  });

  describe('#domNodes', () => {
    it('returns the DOM node for the element itself if it is a DOM element', () => {
      expect(divOne.domNodes).toStrictEqual([divOne.instance]);
    });

    it('returns the instances associated with each child DOM element', () => {
      const element = new Element(defaultTree, [divOne, divTwo], defaultRoot);

      expect(element.domNodes).toStrictEqual([
        divOne.instance,
        divTwo.instance,
      ]);
    });

    it('does not return descendant DOM nodes', () => {
      const element = new Element(defaultTree, [divOne], defaultRoot);

      expect(element.domNodes).not.toContain(divTwo.instance);
    });

    it('does not return instances for non-DOM nodes', () => {
      const element = new Element(defaultTree, [componentOne], defaultRoot);

      expect(element.domNodes).not.toContain(componentOne.instance);
    });
  });

  describe('#domNode', () => {
    it('returns the DOM node for the element itself if it is a DOM element', () => {
      expect(divOne.domNode).toBe(divOne.instance);
    });

    it('returns null if there is no direct child DOM node', () => {
      const element = new Element(defaultTree, [componentOne], defaultRoot);

      expect(element.domNode).toBeNull();
    });

    it('returns the DOM node if there is a single DOM child', () => {
      const element = new Element(defaultTree, [divOne], defaultRoot);

      expect(element.domNode).toBe(divOne.instance);
    });

    it('throws an error if there are multiple top-level DOM nodes', () => {
      const element = new Element(defaultTree, [divOne, divTwo], defaultRoot);

      expect(() => element.domNode).toThrow(/multiple HTML elements/);
    });
  });

  describe('#prop()', () => {
    it('returns the prop value for the specified key', () => {
      const props = {foo: 'bar'};
      const element = new Element({...defaultTree, props}, [], defaultRoot);
      expect(element.prop('foo')).toBe(props.foo);
    });
  });

  describe('#text()', () => {
    it('returns the textContent of the element if it is a DOM node', () => {
      const text = 'foobar';

      const div = document.createElement('div');
      div.textContent = text;

      const element = new Element(
        {...defaultTree, tag: Tag.HostComponent, type: 'div', instance: div},
        [],
        defaultRoot,
      );

      expect(element.text()).toBe(text);
    });

    it('concatenates the text contents of all child elements and child text', () => {
      const childTextOne = 'foo ';
      const childTextTwo = 'bar';

      const elementChild = new Element(defaultTree, [], defaultRoot);
      jest.spyOn(elementChild, 'text').mockImplementation(() => childTextOne);

      const element = new Element(
        {...defaultTree, tag: Tag.FunctionComponent, type: DummyComponent},
        [elementChild, childTextTwo],
        defaultRoot,
      );

      expect(element.text()).toBe(`${childTextOne}${childTextTwo}`);
    });

    it('returns an empty string for portals', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.HostPortal, type: DummyComponent},
        ['Hello world'],
        defaultRoot,
      );

      expect(element.text()).toBe('');
    });
  });

  describe('#html()', () => {
    it('returns the outerHTML of the element if it is a DOM node', () => {
      const html = 'foobar';

      const div = document.createElement('div');
      div.innerHTML = html;

      const element = new Element(
        {...defaultTree, tag: Tag.HostComponent, type: 'div', instance: div},
        [],
        defaultRoot,
      );

      expect(element.html()).toBe(`<div>${html}</div>`);
    });

    it('concatenates the HTML contents of all child elements and child text', () => {
      const childHtml = 'foo ';
      const childText = 'bar';

      const elementChild = new Element(defaultTree, [], defaultRoot);
      jest.spyOn(elementChild, 'text').mockImplementation(() => childHtml);

      const element = new Element(
        {...defaultTree, tag: Tag.FunctionComponent, type: DummyComponent},
        [elementChild, childText],
        defaultRoot,
      );

      expect(element.text()).toBe(`${childHtml}${childText}`);
    });

    it('returns an empty string for portals', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.HostPortal, type: DummyComponent},
        ['Hello world'],
        defaultRoot,
      );

      expect(element.html()).toBe('');
    });
  });

  describe('#is()', () => {
    it('is false if the type does not match', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.HostComponent, type: 'div'},
        [],
        defaultRoot,
      );

      expect(element.is(DummyComponent)).toBe(false);
    });

    it('is true if the type does match', () => {
      const element = new Element(
        {...defaultTree, tag: Tag.FunctionComponent, type: DummyComponent},
        [],
        defaultRoot,
      );

      expect(element.is(DummyComponent)).toBe(true);
    });
  });

  describe('#find()', () => {
    it('finds the first matching DOM node', () => {
      const element = new Element(defaultTree, [componentOne], defaultRoot);

      expect(element.find('div')).toBe(divOne);
    });

    it('finds the first matching component', () => {
      const element = new Element(
        defaultTree,
        [divOne, componentOne],
        defaultRoot,
      );

      expect(element.find(DummyComponent)).toBe(componentOne);
    });

    it('restricts found elements to those with shallow-matching props when props are passed', () => {
      const divOne = new Element(
        {
          ...defaultTree,
          props: {className: 'foo'},
          type: 'div',
          tag: Tag.HostComponent,
          instance: document.createElement('div'),
        },
        [],
        defaultRoot,
      );

      const divTwo = new Element(
        {
          ...defaultTree,
          props: {className: 'bar'},
          type: 'div',
          tag: Tag.HostComponent,
          instance: document.createElement('div'),
        },
        [],
        defaultRoot,
      );

      const span = new Element(
        {
          ...defaultTree,
          props: {className: 'baz'},
          type: 'span',
          tag: Tag.HostComponent,
          instance: document.createElement('span'),
        },
        [],
        defaultRoot,
      );

      const element = new Element(
        defaultTree,
        [divOne, divTwo, span],
        defaultRoot,
      );

      expect(element.find('div', {className: divTwo.props.className})).toBe(
        divTwo,
      );

      expect(element.find('div', {className: span.props.className})).toBeNull();
    });

    it('returns null when no match is found', () => {
      const element = new Element(defaultTree, [], defaultRoot);
      expect(element.find(DummyComponent)).toBeNull();
    });
  });

  describe('#findAll()', () => {
    it('finds all matching DOM nodes', () => {
      const element = new Element(defaultTree, [divOne], defaultRoot);

      expect(element.findAll('div')).toStrictEqual([divOne, divTwo]);
    });

    it('finds all matching components', () => {
      const element = new Element(defaultTree, [componentOne], defaultRoot);

      expect(element.findAll(DummyComponent)).toStrictEqual([
        componentOne,
        componentTwo,
      ]);
    });

    it('restricts found elements to those with shallow-matching props when props are passed', () => {
      const divOne = new Element(
        {
          ...defaultTree,
          props: {className: 'foo'},
          type: 'div',
          tag: Tag.HostComponent,
          instance: document.createElement('div'),
        },
        [],
        defaultRoot,
      );

      const divTwo = new Element(
        {
          ...defaultTree,
          props: {className: 'bar'},
          type: 'div',
          tag: Tag.HostComponent,
          instance: document.createElement('div'),
        },
        [],
        defaultRoot,
      );

      const span = new Element(
        {
          ...defaultTree,
          props: {className: 'baz'},
          type: 'span',
          tag: Tag.HostComponent,
          instance: document.createElement('span'),
        },
        [],
        defaultRoot,
      );

      const element = new Element(
        defaultTree,
        [divOne, divTwo, span],
        defaultRoot,
      );

      expect(
        element.findAll('div', {className: divTwo.props.className}),
      ).toStrictEqual([divTwo]);

      expect(
        element.findAll('div', {className: span.props.className}),
      ).toHaveLength(0);
    });

    it('returns an empty array when no matches are found', () => {
      const element = new Element(defaultTree, [], defaultRoot);
      expect(element.findAll(DummyComponent)).toHaveLength(0);
    });
  });

  describe('#findWhere()', () => {
    it('finds the first matching node', () => {
      const matches = jest.fn(
        (element: Element<unknown>) => element === divTwo,
      );

      const element = new Element(defaultTree, [componentOne], defaultRoot);

      expect(element.findWhere(matches)).toBe(divTwo);
      expect(matches).toHaveBeenCalledWith(componentOne);
      expect(matches).toHaveBeenCalledWith(divOne);
      expect(matches).toHaveBeenCalledWith(divTwo);
    });

    it('returns null when no match is found', () => {
      const element = new Element(defaultTree, [componentOne], defaultRoot);
      expect(element.findWhere(() => false)).toBeNull();
    });
  });

  describe('#findAllWhere()', () => {
    it('finds all matching nodes', () => {
      const element = new Element(defaultTree, [divOne], defaultRoot);
      expect(
        element.findAllWhere((element) => element.type === componentTwo.type),
      ).toHaveLength(0);

      expect(
        element.findAllWhere((element) => element.type === 'div'),
      ).toStrictEqual([divOne, divTwo]);
    });
  });

  describe('#trigger()', () => {
    interface Props {
      onClick?(arg?: string): string;
    }

    function TriggerableComponent(_props: Props) {
      return null;
    }

    it('throws an error if the passed function is not defined', () => {
      const element = new Element<Props>(
        {...defaultTree, type: TriggerableComponent, props: {}},
        [],
        defaultRoot,
      );

      expect(() => element.trigger('onClick')).toThrow(
        /Attempted to call prop onClick/,
      );
    });

    it('calls the prop with the passed arguments', () => {
      const onClick = jest.fn(() => '');
      const element = new Element<Props>(
        {...defaultTree, type: TriggerableComponent, props: {onClick}},
        [],
        defaultRoot,
      );

      const value = 'foobar';
      element.trigger('onClick', value);
      expect(onClick).toHaveBeenCalledWith(value);
    });

    it('wraps the call in a act block from the root', () => {
      const act = jest.spyOn(defaultRoot, 'act');
      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {onClick: () => ''},
        },
        [],
        defaultRoot,
      );

      element.trigger('onClick');
      expect(act).toHaveBeenCalled();
    });

    it('returns the result of calling the prop', () => {
      const returnValue = 'foo';
      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {onClick: () => returnValue},
        },
        [],
        defaultRoot,
      );

      expect(element.trigger('onClick')).toBe(returnValue);
    });

    it('allows passing a deep partial version of the props', () => {
      const partialEvent = {altKey: true};
      const element = new Element<React.HTMLAttributes<HTMLDivElement>>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {onClick: jest.fn()},
        },
        [],
        defaultRoot,
      );

      expect(() => element.trigger('onClick', partialEvent)).not.toThrow();
    });
  });

  describe('#triggerKeypath()', () => {
    interface Action {
      onAction(...args: any[]): any;
    }

    interface Props {
      actions: Action[];
    }

    function TriggerableComponent(_props: Props) {
      return null;
    }

    it('throws an error when the keypath can’t be resolved', () => {
      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {actions: []},
        },
        [],
        defaultRoot,
      );

      expect(() => element.triggerKeypath('actions[1]onAction')).toThrow(
        /Attempted to access field keypath 'actions\.1', but it was not an object/,
      );
    });

    it('throws an error when result of the keypath is not a function', () => {
      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {actions: []},
        },
        [],
        defaultRoot,
      );

      // @ts-expect-error actions is not valid parameter, because it does not point to a function
      expect(() => element.triggerKeypath('actions')).toThrow(
        /Value at keypath 'actions' is not a function/,
      );
    });

    it('calls the keypath function with the passed arguments', () => {
      const onAction = jest.fn();
      const value = 'foo';

      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {actions: [{onAction}]},
        },
        [],
        defaultRoot,
      );

      element.triggerKeypath('actions.0.onAction', value);
      expect(onAction).toHaveBeenCalledWith(value);
    });

    it('returns the result of calling the keypath function', () => {
      const returnValue = 'foo';

      const element = new Element<Props>(
        {
          ...defaultTree,
          type: TriggerableComponent,
          props: {actions: [{onAction: () => returnValue}]},
        },
        [],
        defaultRoot,
      );

      expect(element.triggerKeypath('actions.0.onAction')).toBe(returnValue);
    });
  });
});
