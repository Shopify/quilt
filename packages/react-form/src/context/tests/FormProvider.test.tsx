import React from 'react';
import {mount} from '@shopify/react-testing';
import {faker} from '@faker-js/faker/locale/en';
import {useForm} from 'hooks/form';
import {Field, FieldBag} from 'types';
import {useField} from 'hooks';
import {FormProvider, useFormContext} from 'context/FormProvider';

interface FormFields extends FieldBag {
  name: Field<string>;
}

describe('FormProvider', () => {
  const value = faker.name.firstName();
  const form = useForm<FormFields>({
    fields: {
      name: useField(value),
    },
    onSubmit: jest.fn(),
  });

  function TestChild() {
    const context = useFormContext<FormFields>();
    return <p>{context.fields.name.value}</p>;
  }

  it('provides the form to its children', () => {
    const wrapper = mount(
      <FormProvider form={form}>
        <TestChild />
      </FormProvider>,
    );
    expect(wrapper).toContainReactComponent('p', {
      children: form.fields.name.value,
    });
  });
});
