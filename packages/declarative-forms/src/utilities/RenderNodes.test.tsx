import {
  StringNode,
  mountDeclarativeForm,
  decorate,
  ItemDeleteButton,
} from '../tests/utilities';
import {validatorsFixtures} from '../tests/fixtures';

describe('renderNodes / renderNode / useNode', () => {
  const schema = {
    attributes: {
      someText: {
        type: 'string',
        value: 'abc',
        validators: [validatorsFixtures.Presence],
      },
      someNumber: {
        type: 'integer',
      },
      someWatcher: {
        type: 'string',
        watch: 'someText',
        value: 'unknown',
      },
    },
  };

  it('renders nodes using decorator functions', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});
    expect(wrapper).toContainReactComponent(StringNode, {type: undefined});
    expect(wrapper).toContainReactComponent(StringNode, {type: 'number'});
    expect(node.data()).toStrictEqual({
      someText: 'abc',
      someNumber: 0,
      someWatcher: 'abc',
    });
  });

  it('reacts when setting the focus to a field', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});

    const textInput = wrapper.find('input', {name: 'someText'})!;
    const numberInput = wrapper.find('input', {name: 'someNumber'})!;

    // initial state
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(false);

    // focus the string node
    await wrapper.act(() => node.context.focusField('someText'));
    expect(textInput.domNode === document.activeElement).toBe(true);
    expect(numberInput.domNode === document.activeElement).toBe(false);

    // focus another field
    await wrapper.act(() => node.context.focusField('someNumber'));
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(true);

    // focus unexisting field
    await wrapper.act(() => node.context.focusField('unexisting'));
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(false);
  });

  it('watches walue change with useWatcher', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});
    expect(wrapper).toContainReactComponent(StringNode, {type: undefined});
    expect(wrapper).toContainReactComponent(StringNode, {type: 'number'});
    expect(node.data()).toStrictEqual({
      someText: 'abc',
      someNumber: 0,
      someWatcher: 'abc',
    });
    wrapper.act(() => {
      node.children.someText.onChange('def');
    });
    expect(node.data()).toStrictEqual({
      someText: 'def',
      someNumber: 0,
      someWatcher: 'def',
    });
  });

  it('useNode reacts when the context is updated using updateContext', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});

    expect(wrapper).not.toContainReactComponent('strong');

    await wrapper.act(() =>
      node.context.updateContext('errors', {
        generic: [],
        someText: ['Server error'],
      }),
    );

    expect(wrapper).toContainReactComponent('strong', {
      children: 'Server error',
    });
  });

  it('addListItem can take a value as first argument and hydrate the node correctly', async () => {
    const initialListValue = [
      {name: 'John', staff: false},
      {name: 'Jane', staff: true},
    ];
    const {wrapper, node} = await mountDeclarativeForm({
      schema: {
        type: ['user'],
        value: initialListValue,
        attributes: {
          name: {type: 'string'},
          staff: {type: 'boolean'},
        },
      },
      customDecorator(context) {
        decorate(context);

        context
          .where(({isList, type}) => !isList && type === 'user')
          .appendWith(ItemDeleteButton);
      },
    });

    const itemAdditionValues = {
      name: 'Joe',
      staff: true,
    };

    expect(wrapper).toContainReactComponentTimes('div', 2, {
      className: 'list-item',
    });

    wrapper.act(() => {
      node.addListItem(itemAdditionValues);
    });

    expect(node.data()).toStrictEqual([
      ...initialListValue,
      itemAdditionValues,
    ]);

    expect(wrapper).toContainReactComponentTimes('div', 3, {
      className: 'list-item',
    });

    function deleteFirstItem() {
      const item1 = wrapper.find('div', {title: '0'})!;
      item1.find('button')!.trigger('onClick');
    }

    // item[0]
    deleteFirstItem();
    // item[1]
    deleteFirstItem();

    expect(wrapper).toContainReactComponentTimes('div', 1, {
      className: 'list-item',
    });

    expect(node.data()).toStrictEqual([itemAdditionValues]);
  });
});
