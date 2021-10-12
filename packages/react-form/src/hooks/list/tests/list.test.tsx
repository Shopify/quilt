/* eslint-disable react/no-array-index-key */
import React from 'react';
import {mount} from '@shopify/react-testing';

import {useList} from '../list';
import {FieldListConfig} from '../baselist';

import {randomVariants, TextField, Variant} from './utils';

describe('useList', () => {
  function List(config: FieldListConfig<Variant>) {
    const variants = useList<Variant>(config);

    return (
      <ul>
        {variants.map((fields, index) => (
          <li key={index}>
            <TextField label="price" name={`price${index}`} {...fields.price} />
            <TextField
              label="option"
              name={`option${index}`}
              {...fields.optionName}
            />
            <TextField
              label="value"
              name={`value${index}`}
              {...fields.optionValue}
            />
          </li>
        ))}
      </ul>
    );
  }

  it('returns the right number of field items', () => {
    const variants = randomVariants(4);
    const wrapper = mount(<List list={variants} />);

    expect(wrapper.findAll(TextField)).toHaveLength(12);
  });
});
