import React from 'react';
import faker from '@faker-js/faker/locale/en';
import {mount} from '@shopify/react-testing';

// eslint-disable-next-line @shopify/strict-component-boundaries
import {Input} from '../../tests/components';
import {lastCallArgs} from '../../tests/utilities';
import FormState, {arrayUtils} from '../..';
import {FieldDescriptor, FieldDescriptors} from '../../types';

describe('<FormState.List />', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('passes form state into child function for each index of the given array', () => {
    const renderPropSpy = jest.fn(
      (_: FieldDescriptors<{title: string}>) => null,
    );

    const products = [
      {title: faker.commerce.productName()},
      {title: faker.commerce.productName()},
      {title: faker.commerce.productName()},
    ];

    mount(
      <FormState initialValues={{products}}>
        {({fields}) => {
          return (
            <FormState.List field={fields.products}>
              {renderPropSpy}
            </FormState.List>
          );
        }}
      </FormState>,
    );

    const calls = renderPropSpy.mock.calls;
    expect(calls).toHaveLength(products.length);

    calls.forEach(([fields], index) => {
      const expectedTitle = products[index].title;

      expect(fields.title).toMatchObject({
        value: expectedTitle,
        initialValue: expectedTitle,
        dirty: false,
        name: `products.${index}.title`,
      });
    });
  });

  it('uses getChildKey to determine keys for each item', () => {
    const products = [{title: faker.commerce.productName()}];

    const childKeySpy = jest.fn((item) => item.title);

    mount(
      <FormState initialValues={{products}}>
        {({fields}) => {
          return (
            <FormState.List field={fields.products} getChildKey={childKeySpy}>
              {(_) => <div />}
            </FormState.List>
          );
        }}
      </FormState>,
    );

    expect(childKeySpy).toHaveBeenCalledWith(products[0]);
    // Enzyme still has incomplete support for fragments so we can't actually test that the key is rendered
    // expect(wrapper.find('Fragment').key()).toBe(products[0].title);
  });

  it('updates the top level FormState‘s array when an inner field is updated', () => {
    const products = [{title: faker.commerce.productName()}];
    const newTitle = faker.commerce.productName();

    const renderPropSpy = jest.fn(({fields}: any) => {
      return (
        <FormState.List field={fields.products}>
          {(fields: any) => {
            return <Input {...fields.title} />;
          }}
        </FormState.List>
      );
    });

    const form = mount(
      <FormState initialValues={{products}}>{renderPropSpy}</FormState>,
    );

    const input = form.find(Input)!;
    input.trigger('onChange', newTitle);

    const {fields} = lastCallArgs(renderPropSpy);
    expect(fields.products.value[0].title).toBe(newTitle);
  });

  it('updates multiple sub-field properties', () => {
    const products = [
      {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
      },
      {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
      },
    ];

    const newTitle = faker.commerce.productName();
    const newPrice = faker.commerce.price();

    const renderPropSpy = jest.fn(({fields}: any) => {
      return (
        <FormState.List field={fields.products}>
          {(fields: any) => {
            return (
              <>
                <Input {...fields.title} />
                <Input {...fields.price} />
              </>
            );
          }}
        </FormState.List>
      );
    });

    const form = mount(
      <FormState initialValues={{products}}>{renderPropSpy}</FormState>,
    );

    const titleInput = form.find(Input)!;
    titleInput.trigger('onChange', newTitle);

    const priceInput = form.findAll(Input)[1];
    priceInput.trigger('onChange', newPrice);

    const {fields} = lastCallArgs(renderPropSpy);
    expect(fields.products.value[0].title).toBe(newTitle);
    expect(fields.products.value[0].price).toBe(newPrice);
  });

  it('tracks individual sub-field dirty state', () => {
    const products = [{title: faker.commerce.productName()}];
    const newTitle = faker.commerce.productName();

    const renderSpy = jest.fn(() => null);

    const wrapper = mount(
      <FormState initialValues={{products}}>
        {({fields}) => {
          return (
            <>
              <FormState.List field={fields.products}>
                {renderSpy}
              </FormState.List>
            </>
          );
        }}
      </FormState>,
    );

    const {title} = lastCallArgs(renderSpy);
    wrapper.act(() => title.onChange(newTitle));

    const updatedFields = lastCallArgs(renderSpy);
    expect(updatedFields.title.dirty).toBe(true);
  });

  it('passes errors down to inner fields', () => {
    interface Product {
      title: string;
      department: string;
    }

    const products: Product[] = [
      {
        title: faker.commerce.productName(),
        department: faker.commerce.department(),
      },
      {
        title: faker.commerce.productName(),
        department: faker.commerce.department(),
      },
    ];

    const field = {
      name: 'products',
      value: products,
      initialValue: products,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      dirty: false,
      changed: false,
      error: [
        {
          title: faker.lorem.words(5),
        },
        {
          department: faker.lorem.words(5),
        },
      ],
    };

    const renderSpy = jest.fn((_: FieldDescriptors<Product>) => null);
    mount(<FormState.List field={field}>{renderSpy}</FormState.List>);

    renderSpy.mock.calls.forEach(([fields], index) => {
      const {title, department} = fields;

      expect(title.error).toBe(field.error[index].title);
      expect(department.error).toBe(field.error[index].department);
    });
  });

  it('does not have race condition with multiple onChange calls', () => {
    const products = [
      {
        title: faker.commerce.productName(),
        department: faker.commerce.department(),
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

    const renderPropSpy = jest.fn(({fields}: any) => {
      return (
        <FormState.List field={fields.products}>{renderSpy}</FormState.List>
      );
    });

    const wrapper = mount(
      <FormState initialValues={{products}}>{renderPropSpy}</FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    wrapper.act(() => {
      title.onChange(newTitle);
      department.onChange(newDepartment);
    });

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });

  it('does not have race condition with nested List components', () => {
    const variants = [
      {
        products: [
          {
            title: faker.commerce.productName(),
            department: faker.commerce.department(),
          },
        ],
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

    const wrapper = mount(
      <FormState initialValues={{variants}}>
        {({fields}) => (
          <FormState.List field={fields.variants}>
            {(nestedFields) => (
              <FormState.List field={nestedFields.products}>
                {renderSpy}
              </FormState.List>
            )}
          </FormState.List>
        )}
      </FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    wrapper.act(() => {
      title.onChange(newTitle);
      department.onChange(newDepartment);
    });

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });

  it('does not have race condition when using Nested -> List', () => {
    const variants = {
      products: [
        {
          title: faker.commerce.productName(),
          department: faker.commerce.department(),
        },
      ],
    };

    const renderSpy = jest.fn(({title, department}) => {
      return (
        <>
          <Input label="title" {...title} />
          <Input label="department" {...department} />
        </>
      );
    });

    const wrapper = mount(
      <FormState initialValues={{variants}}>
        {({fields}) => (
          <FormState.Nested field={fields.variants}>
            {(nestedFields) => (
              <FormState.List field={nestedFields.products}>
                {renderSpy}
              </FormState.List>
            )}
          </FormState.Nested>
        )}
      </FormState>,
    );

    const {title, department} = lastCallArgs(renderSpy);

    const newTitle = faker.commerce.productName();
    const newDepartment = faker.commerce.department();

    wrapper.act(() => {
      title.onChange(newTitle);
      department.onChange(newDepartment);
    });

    const updatedFields = lastCallArgs(renderSpy);

    expect(updatedFields.title.value).toBe(newTitle);
    expect(updatedFields.department.value).toBe(newDepartment);
  });

  it('does not raise an exceptions when lists are nested in lists', () => {
    function newProduct() {
      return {
        variants: [
          {
            title: faker.commerce.department(),
          },
        ],
      };
    }
    const products = [newProduct()];

    const renderSpy = jest.fn(({title}) => {
      return <Input label="title" {...title} />;
    });

    let productsRef: FieldDescriptor<any>;
    const wrapper = mount(
      <FormState initialValues={{products}}>
        {({fields}) => {
          productsRef = fields.products;
          return (
            <FormState.List field={fields.products}>
              {(nestedProductFields) => (
                <FormState.List field={nestedProductFields.variants}>
                  {renderSpy}
                </FormState.List>
              )}
            </FormState.List>
          );
        }}
      </FormState>,
    );

    const newProducts = [...products, newProduct()];
    wrapper.act(() => {
      productsRef!.onChange(newProducts);
    });
    const calls = renderSpy.mock.calls;
    const originalRenderCount = 1;
    const rerenderedCount = 2;
    expect(calls).toHaveLength(originalRenderCount + rerenderedCount);
  });

  it('does not raise an exceptions when list items are nested', () => {
    const variants = [
      {
        product: {
          title: faker.commerce.department(),
        },
      },
    ];

    const renderSpy = jest.fn(({title}) => {
      return <Input label="title" {...title} />;
    });

    let variantsRef: FieldDescriptor<any>;
    const wrapper = mount(
      <FormState initialValues={{variants}}>
        {({fields}) => {
          variantsRef = fields.variants;
          return (
            <>
              <FormState.List field={fields.variants}>
                {(nestedFields) => (
                  <FormState.Nested field={nestedFields.product}>
                    {renderSpy}
                  </FormState.Nested>
                )}
              </FormState.List>
            </>
          );
        }}
      </FormState>,
    );

    const newVariants = arrayUtils.push(variantsRef!.value, {
      product: {
        title: 'newProduct',
      },
    });
    wrapper.act(() => variantsRef!.onChange(newVariants));
    const calls = renderSpy.mock.calls;
    const originalRenderCount = variants.length;
    const rerenderedCount = originalRenderCount + 1;
    expect(calls).toHaveLength(originalRenderCount + rerenderedCount);
  });
});
