import React from 'react';
import faker from 'faker';
import {mount} from '@shopify/react-testing';

// eslint-disable-next-line shopify/strict-component-boundaries
import {Input} from '../../tests/components';
import {lastCallArgs} from '../../tests/utilities';
import FormState from '../..';

describe('<Nested />', () => {
  it('passes field state into child function', () => {
    const renderPropSpy = jest.fn(() => null);

    const product = {
      title: faker.commerce.productName(),
      adjective: faker.commerce.productAdjective(),
    };

    mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <FormState.Nested field={fields.product}>
              {renderPropSpy}
            </FormState.Nested>
          );
        }}
      </FormState>,
    );

    expect(renderPropSpy).toHaveBeenCalledWith({
      title: {
        name: 'product.title',
        dirty: false,
        error: undefined,
        initialValue: product.title,
        value: product.title,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      },
      adjective: {
        name: 'product.adjective',
        dirty: false,
        error: undefined,
        initialValue: product.adjective,
        value: product.adjective,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      },
    });
  });

  it('updates the top level FormState‘s array when an inner field is updated', () => {
    const product = {title: faker.commerce.productName()};
    const newTitle = faker.commerce.productName();

    const renderPropSpy = jest.fn(({fields: {product}}: any) => {
      return (
        <FormState.Nested field={product}>
          {({title}: any) => {
            return <Input label="title" {...title} />;
          }}
        </FormState.Nested>
      );
    });

    const form = mount(
      <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
    );

    form.find(Input)!.trigger('onChange', newTitle);

    const {fields} = lastCallArgs(renderPropSpy);
    expect(fields.product.value.title).toBe(newTitle);
  });

  it('tracks field dirty state', () => {
    const product = {title: faker.commerce.productName()};
    const newTitle = faker.commerce.productName();

    const renderSpy = jest.fn(() => null);

    mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <FormState.Nested field={fields.product}>
              {renderSpy}
            </FormState.Nested>
          );
        }}
      </FormState>,
    );

    const {title} = lastCallArgs(renderSpy);
    title.onChange(newTitle);

    const updatedFields = lastCallArgs(renderSpy);
    expect(updatedFields.title.dirty).toBe(true);
  });

  it('passes errors down to inner fields', () => {
    const product = {
      title: faker.commerce.productName(),
      department: faker.commerce.department(),
    };

    const field = {
      name: 'product',
      value: product,
      initialValue: product,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      dirty: false,
      changed: false,
      error: {
        title: faker.lorem.words(5),
        department: faker.lorem.words(5),
      },
    };

    const renderSpy = jest.fn(() => null);
    mount(<FormState.Nested field={field}>{renderSpy}</FormState.Nested>);

    const renderPropArgs = lastCallArgs(renderSpy);

    expect(renderPropArgs.title.error).toBe(field.error.title);
    expect(renderPropArgs.department.error).toBe(field.error.department);
  });

  it('does not have race condition with multiple onChange calls', () => {
    const product = {
      title: faker.commerce.productName(),
      department: faker.commerce.department(),
    };

    const renderSpy = jest.fn(({title, department}) => {
      return (
        <>
          <Input label="title" {...title} />
          <Input label="department" {...department} />
        </>
      );
    });

    mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <FormState.Nested field={fields.product}>
              {renderSpy}
            </FormState.Nested>
          );
        }}
      </FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    title.onChange(newTitle);
    department.onChange(newDepartment);

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });

  it('does not have race condition when using Nested -> Nested', () => {
    const product = {
      nested: {
        title: faker.commerce.productName(),
        department: faker.commerce.department(),
      },
    };

    const renderSpy = jest.fn(({title, department}) => {
      return (
        <>
          <Input label="title" {...title} />
          <Input label="department" {...department} />
        </>
      );
    });

    mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <FormState.Nested field={fields.product}>
              {nestedFields => (
                <FormState.Nested field={nestedFields.nested}>
                  {renderSpy}
                </FormState.Nested>
              )}
            </FormState.Nested>
          );
        }}
      </FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    title.onChange(newTitle);
    department.onChange(newDepartment);

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });

  it('does not have race condition when using List -> Nested', () => {
    const product = [
      {
        nested: {
          title: faker.commerce.productName(),
          department: faker.commerce.department(),
        },
      },
    ];

    const renderSpy = jest.fn(({title, department}) => {
      return (
        <>
          <Input label="title" {...title} />
          <Input label="department" {...department} />
        </>
      );
    });

    mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <FormState.List field={fields.product}>
              {nestedFields => (
                <FormState.Nested field={nestedFields.nested}>
                  {renderSpy}
                </FormState.Nested>
              )}
            </FormState.List>
          );
        }}
      </FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    title.onChange(newTitle);
    department.onChange(newDepartment);

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });
});
