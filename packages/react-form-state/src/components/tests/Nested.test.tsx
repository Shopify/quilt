import React from 'react';
import faker from 'faker';
import {mount} from 'enzyme';

import {Input} from './components';
import FormState from '../..';

const ARBITRARY_SEED = 1337;

describe('<Nested />', () => {
  beforeEach(() => {
    faker.seed(ARBITRARY_SEED);
  });

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

    expect(renderPropSpy).toBeCalledWith({
      title: {
        name: 'nodejs.title',
        dirty: false,
        // eslint-disable-next-line no-undefined
        error: undefined,
        initialValue: product.title,
        value: product.title,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      },
      adjective: {
        name: 'nodejs.adjective',
        dirty: false,
        // eslint-disable-next-line no-undefined
        error: undefined,
        initialValue: product.adjective,
        value: product.adjective,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      },
    });
  });

  it("updates the top level FormState's array when an inner field is updated", () => {
    const product = {title: faker.commerce.productName()};
    const newTitle = faker.commerce.productName();

    const renderPropSpy = jest.fn(({fields: {product}}: any) => {
      return (
        <>
          <FormState.Nested field={product}>
            {({title}: any) => {
              return <Input label="title" {...title} />;
            }}
          </FormState.Nested>
        </>
      );
    });

    const form = mount(
      <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
    );

    form
      .find(Input)
      .props()
      .onChange(newTitle);
    form.update();

    const {fields} = lastCallArgs(renderPropSpy);

    expect(fields.product.value.title).toBe(newTitle);
  });

  it('tracks field dirty state', () => {
    const product = {title: faker.commerce.productName()};
    const newTitle = faker.commerce.productName();

    const renderSpy = jest.fn(() => null);

    const form = mount(
      <FormState initialValues={{product}}>
        {({fields}) => {
          return (
            <>
              <FormState.Nested field={fields.product}>
                {renderSpy}
              </FormState.Nested>
            </>
          );
        }}
      </FormState>,
    );

    const {title} = lastCallArgs(renderSpy);
    title.onChange(newTitle);

    form.update();

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
});

function lastCallArgs(spy: jest.Mock) {
  const calls = spy.mock.calls;
  return calls[calls.length - 1][0];
}

function TextField({onChange, ...props}: any) {
  return <input {...props} />;
}
