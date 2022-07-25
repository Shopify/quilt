/* eslint-disable react/no-array-index-key */
import React from 'react';
import {mount} from '@shopify/react-testing';

import {useDynamicList} from '../dynamiclist';
import {FieldListConfig} from '../baselist';

import {Variant, randomVariants, clickEvent, TextField} from './utils';

describe('useDynamicList', () => {
  describe('add and remove fields', () => {
    const factory = () => {
      return {price: '', optionName: '', optionValue: ''};
    };
    function DynamicListComponent(config: FieldListConfig<Variant>) {
      const {fields, addItem, removeItem, moveItem, reset, dirty} =
        useDynamicList<Variant>(config, factory);

      return (
        <>
          <ul>
            {fields.map((fields, index) => (
              <li key={index}>
                <TextField
                  label="price"
                  name={`price${index}`}
                  {...fields.price}
                />
                <button type="button" onClick={() => removeItem(index)}>
                  Remove Variant
                </button>
                <button
                  type="button"
                  title="move up"
                  onClick={() => {
                    moveItem(index, index - 1);
                  }}
                >
                  Move Variant up
                </button>
              </li>
            ))}
            <button type="button" onClick={() => addItem()}>
              Add Variant
            </button>
          </ul>
          <button type="button" onClick={reset}>
            Reset
          </button>
          <p>Dirty: {dirty.toString()}</p>
        </>
      );
    }

    it('can move field to a new position', () => {
      const variants: Variant[] = [
        {price: 'A', optionName: 'A', optionValue: 'A'},
        {price: 'B', optionName: 'B', optionValue: 'B'},
        {price: 'C', optionName: 'C', optionValue: 'C'},
      ];

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .findAll('button', {children: 'Move Variant up'})![2]
        .trigger('onClick');

      const sort1 = wrapper
        .findAll('li')
        .map((i) => i.find(TextField)!.props.value);

      expect(sort1).toStrictEqual(['A', 'C', 'B']);
    });

    it('will throw an error if new position is out of index range', () => {
      const consoleErrorMock = jest.spyOn(console, 'error');
      consoleErrorMock.mockImplementation();

      const variants: Variant[] = [
        {price: 'A', optionName: 'A', optionValue: 'A'},
        {price: 'B', optionName: 'B', optionValue: 'B'},
        {price: 'C', optionName: 'C', optionValue: 'C'},
      ];

      const wrapper = mount(<DynamicListComponent list={variants} />);

      expect(() => {
        wrapper
          .findAll('button', {children: 'Move Variant up'})![0]
          .trigger('onClick');
      }).toThrow('Failed to move item from 0 to -1');

      consoleErrorMock.mockRestore();
    });

    it('can remove field', () => {
      const variants: Variant[] = randomVariants(1);

      const wrapper = mount(<DynamicListComponent list={variants} />);
      wrapper
        .find('button', {children: 'Remove Variant'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).not.toContainReactComponent(TextField);
    });

    it('can add field', () => {
      const variants: Variant[] = randomVariants(1);

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .find('button', {children: 'Add Variant'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price1',
        value: '',
      });
    });

    it('can add field and maintains previous field value', () => {
      const variants: Variant[] = randomVariants(1);

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .find('button', {children: 'Add Variant'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: variants[0].price,
      });
    });

    it('can remove field and maintains previous field value', () => {
      const variants: Variant[] = randomVariants(1);

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .find('button', {children: 'Add Variant'})!
        .trigger('onClick', clickEvent());

      wrapper
        .findAll('button', {children: 'Remove Variant'})![1]
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: variants[0].price,
      });
    });

    it('cannot remove field when there are no items', () => {
      const variants: Variant[] = [];

      const wrapper = mount(<DynamicListComponent list={variants} />);

      expect(
        wrapper.findAll('button', {children: 'Remove Variant'}),
      ).toHaveLength(0);
    });

    describe('reset dynamic list', () => {
      it('can reset a dynamic list after adding a field', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(<DynamicListComponent list={variants} />);

        wrapper
          .find('button', {children: 'Add Variant'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField, {
          name: 'price1',
          value: '',
        });

        wrapper
          .find('button', {children: 'Reset'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField, {
          name: 'price1',
          value: '',
        });
      });

      it('can reset a dynamic list after removing a field', () => {
        const variants: Variant[] = randomVariants(1);

        const wrapper = mount(<DynamicListComponent list={variants} />);

        wrapper
          .find('button', {children: 'Remove Variant'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).not.toContainReactComponent(TextField);

        wrapper
          .find('button', {children: 'Reset'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactComponent(TextField);
      });
    });

    describe('dirty dynamic list', () => {
      it('handles dirty state when changing the value of a field', () => {
        const wrapper = mount(
          <DynamicListComponent list={randomVariants(1)} />,
        );

        expect(wrapper).toContainReactText('Dirty: false');

        wrapper
          .find(TextField, {name: 'price0'})!
          .trigger('onChange', 'new value');

        expect(wrapper).toContainReactText('Dirty: true');

        wrapper
          .find('button', {children: 'Reset'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactText('Dirty: false');
      });

      it('handles dirty state when adding a field and resetting it', () => {
        const wrapper = mount(
          <DynamicListComponent list={randomVariants(1)} />,
        );

        expect(wrapper).toContainReactText('Dirty: false');

        wrapper
          .find('button', {children: 'Add Variant'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactText('Dirty: true');

        wrapper
          .find('button', {children: 'Reset'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactText('Dirty: false');
      });

      it('handles dirty state when removing a field and resetting it', () => {
        const wrapper = mount(
          <DynamicListComponent list={randomVariants(1)} />,
        );

        expect(wrapper).toContainReactText('Dirty: false');

        wrapper
          .find('button', {children: 'Remove Variant'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactText('Dirty: true');

        wrapper
          .find('button', {children: 'Reset'})!
          .trigger('onClick', clickEvent());

        expect(wrapper).toContainReactText('Dirty: false');
      });
    });
  });

  describe('add mulitiple items with payload', () => {
    const factory = (argument: any) => {
      const {price, optionName, optionValue} = argument;
      return [
        {price, optionName, optionValue},
        {price: '', optionName: '', optionValue: ''},
      ];
    };

    const payload = {
      price: '1000',
      optionName: 'option1',
      optionValue: '1000',
    };
    function DynamicListComponent(config: FieldListConfig<Variant>) {
      const {fields, addItem} = useDynamicList<Variant>(config, factory);

      return (
        <ul>
          {fields.map((fields, index) => (
            <li key={index}>
              <TextField
                label="price"
                name={`price${index}`}
                {...fields.price}
              />
            </li>
          ))}
          <button type="button" onClick={() => addItem(payload)}>
            Add Variant
          </button>
        </ul>
      );
    }

    it('adds multiple items from factory', () => {
      const variants: Variant[] = randomVariants(1);

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .find('button', {children: 'Add Variant'})!
        .trigger('onClick', clickEvent());

      expect(wrapper.findAll(TextField)).toHaveLength(3);
    });

    it('calls factory with payload', () => {
      const variants: Variant[] = [];

      const wrapper = mount(<DynamicListComponent list={variants} />);

      wrapper
        .find('button', {children: 'Add Variant'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent(TextField, {
        name: 'price0',
        value: payload.price,
      });
    });
  });

  describe('value, newDefaultValue and defaultValue', () => {
    function TestListWithValue(config: FieldListConfig<Variant>) {
      const factory = () => {
        return {price: '', optionName: '', optionValue: ''};
      };
      const {value, newDefaultValue, dirty, addItem, defaultValue} =
        useDynamicList<Variant>(config, factory);

      const onNewDefault = (value: Variant[]) => {
        newDefaultValue(value);
      };

      return (
        <>
          {value.map((variants) => (
            <>
              <p>Value: {variants.price}</p>
              <p>Value: {variants.optionName}</p>
              <p>Value: {variants.optionValue}</p>
            </>
          ))}

          {defaultValue.map((variants) => (
            <>
              <p>Default: {variants.price}</p>
              <p>Default: {variants.optionName}</p>
              <p>Default: {variants.optionValue}</p>
            </>
          ))}

          <button type="button" onClick={onNewDefault as any}>
            Default
          </button>
          <button type="button" onClick={() => addItem()}>
            Add Variant
          </button>
          <button type="button" disabled={!dirty}>
            Reset
          </button>
        </>
      );
    }

    it('returns the value of the dynamiclist', () => {
      const price = '1.00';
      const optionName = 'material';
      const optionValue = 'cotton';
      const variants: Variant[] = [
        {
          price,
          optionName,
          optionValue,
        },
      ];

      const wrapper = mount(<TestListWithValue list={variants} />);
      expect(wrapper).toContainReactText(`Value: ${price}`);
      expect(wrapper).toContainReactText(`Value: ${optionName}`);
      expect(wrapper).toContainReactText(`Value: ${optionValue}`);
    });

    it('sets and returns the default value of the dynamic list', () => {
      const price = '1.00';
      const optionName = 'material';
      const optionValue = 'cotton';
      const variants: Variant[] = [
        {
          price,
          optionName,
          optionValue,
        },
      ];
      const newDefaultPrice = '2.00';
      const newDefaultOption = 'color';
      const newDefaultOptionValue = 'blue';

      const wrapper = mount(<TestListWithValue list={variants} />);

      expect(wrapper).toContainReactText(`Default: ${price}`);
      expect(wrapper).toContainReactText(`Default: ${optionName}`);
      expect(wrapper).toContainReactText(`Default: ${optionValue}`);

      wrapper.find('button', {children: 'Default'})!.trigger('onClick', [
        {
          price: newDefaultPrice,
          optionName: newDefaultOption,
          optionValue: newDefaultOptionValue,
        },
      ] as any);

      expect(wrapper).toContainReactText(`Default: ${newDefaultPrice}`);
      expect(wrapper).toContainReactText(`Default: ${newDefaultOption}`);
      expect(wrapper).toContainReactText(`Default: ${newDefaultOptionValue}`);
    });
  });
});
