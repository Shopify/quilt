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
      const {fields, addItem, removeItem} = useDynamicList<Variant>(
        config,
        factory,
      );

      return (
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
            </li>
          ))}
          <button type="button" onClick={() => addItem()}>
            Add Variant
          </button>
        </ul>
      );
    }

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

      // const addedTextField = wrapper.findAll(TextField)![0];

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
});
