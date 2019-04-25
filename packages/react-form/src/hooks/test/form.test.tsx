import React from 'react';
import faker from 'faker';
import {mount} from '@shopify/react-testing';
import {useList, useField, useForm, submitSuccess, submitFail} from '..';
import {SubmitHandler} from '../../types';
import {positiveNumericString, notEmpty} from '../../validation';

interface SimpleProduct {
  title: string;
  description: string;
  defaultVariant: {
    optionName: string;
    optionValue: string;
    price: string;
  };
  variants: {
    id: string;
    optionName: string;
    optionValue: string;
    price: string;
  }[];
}

describe('useForm', () => {
  function ProductForm({
    data,
    onSubmit,
  }: {
    data: SimpleProduct;
    onSubmit?: SubmitHandler<SimpleProduct>;
  }) {
    const title = useField({
      value: data.title,
      validates: notEmpty('Title is required!'),
    });
    const description = useField(data.description);

    const defaultVariant = {
      price: useField({
        value: data.defaultVariant.price,
        validates: positiveNumericString('price must be a number'),
      }),
      optionName: useField(data.defaultVariant.optionName),
      optionValue: useField(data.defaultVariant.optionValue),
    };

    const variants = useList({
      list: data.variants,
      validates: {
        price: positiveNumericString('price must be a number'),
      },
    });

    const {submit, submitting, dirty, reset, submitErrors} = useForm({
      fields: {title, description, defaultVariant, variants},
      onSubmit: onSubmit as any,
    });

    return (
      <form onSubmit={submit}>
        {submitting && <p>loading...</p>}
        {submitErrors.length > 0 && <p>{submitErrors.join(', ')}</p>}
        <fieldset>
          <TextField label="title" {...title} />
          <TextField label="description" {...description} />
        </fieldset>
        <fieldset name="default-variant">
          <TextField label="price" {...defaultVariant.price} />
          <TextField label="option" {...defaultVariant.optionName} />
          <TextField label="value" {...defaultVariant.optionValue} />
        </fieldset>
        {variants.map(({price, optionName, optionValue, id}) => (
          <fieldset name="default-variant" key={id.value}>
            <TextField label="price" {...price} />
            <TextField label="option" {...optionName} />
            <TextField label="value" {...optionValue} />
          </fieldset>
        ))}
        <button type="button" disabled={!dirty} onClick={reset}>
          Reset
        </button>
        <button type="submit" disabled={!dirty} onClick={submit}>
          Submit
        </button>
      </form>
    );
  }

  describe('dirty state', () => {
    it('dirty state is false when no field has been changed', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', 'Floobogs, the shoe for ogres');

      expect(wrapper).toContainReactComponent('button', {
        type: 'button',
        disabled: false,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'submit',
        disabled: false,
      });
    });

    it('dirty state is true when any field has been changed', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', 'Floobogs, the shoe for ogres');

      expect(wrapper).toContainReactComponent('button', {
        type: 'button',
        disabled: false,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'submit',
        disabled: false,
      });
    });

    it("dirty state is false when a field is changed and then returned to it's starting value", () => {
      const product = fakeProduct();
      const wrapper = mount(<ProductForm data={product} />);

      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', 'Floobogs, the shoe for ogres');
      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', product.title);

      expect(wrapper).toContainReactComponent('button', {
        type: 'button',
        disabled: true,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'submit',
        disabled: true,
      });
    });
  });

  describe('submit', () => {
    it('sets submitting to true during submission', () => {
      const wrapper = mount(
        <ProductForm
          data={fakeProduct()}
          onSubmit={() => new Promise(() => {})}
        />,
      );

      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', 'tortoritos, the chip for turtles!');

      wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent('p', {
        children: 'loading...',
      });
    });

    // Async act() issues block this test https://github.com/facebook/react/issues/15379
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('sets submitting to false when submission ends', async () => {
      const promise = Promise.resolve(submitSuccess());
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', 'tortoritos, the chip for turtles!');

      wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      await promise;

      expect(wrapper).not.toContainReactComponent('p', {
        children: 'loading...',
      });
    });

    it('validates all fields before submitting and bails out if any fail', () => {
      const submitSpy = jest.fn(() => Promise.resolve(submitSuccess()));
      const product = {
        ...fakeProduct(),
        title: '',
      };
      const wrapper = mount(
        <ProductForm data={product} onSubmit={submitSpy} />,
      );

      wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      expect(submitSpy).not.toHaveBeenCalled();
      expect(wrapper).toContainReactComponent('p', {
        children: 'Title is required!',
      });
    });

    // Async act() issues block this test https://github.com/facebook/react/issues/15379
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('returns remote submission errors', async () => {
      const error = {message: 'The server hates it'};
      const submitSpy = jest.fn(() => Promise.resolve(submitFail([error])));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={submitSpy} />,
      );

      await wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent('p', {
        children: error.message,
      });
    });

    // Async act() issues block this test https://github.com/facebook/react/issues/15379
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('propagates remote submission errors to matching fields', async () => {
      const errors = [
        {
          fieldPath: ['variants', '0', 'price'],
          message: 'The server hates your price',
        },
      ];
      const submitSpy = jest.fn(() => Promise.resolve(submitFail(errors)));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={submitSpy} />,
      );

      await wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });
  });

  describe('reset', () => {
    it('resets all fields', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      const newProduct = 'Submarine full of gnomes';
      wrapper
        .find(TextField, {label: 'title'})!
        .trigger('onChange', newProduct);
      wrapper
        .find('button', {type: 'button'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).not.toContainReactComponent(TextField, {
        value: newProduct,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'button',
        disabled: true,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'submit',
        disabled: true,
      });
    });

    // Async act() issues block this test https://github.com/facebook/react/issues/15379
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('resets errors from previous submissions', async () => {
      const errors = [
        {
          fieldPath: ['variants', '0', 'price'],
          message: 'The server hates your price',
        },
      ];
      const submitSpy = jest.fn(() => Promise.resolve(submitFail(errors)));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={submitSpy} />,
      );

      await wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());

      await wrapper
        .find('button', {type: 'reset'})!
        .trigger('onClick', clickEvent());

      expect(wrapper).not.toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });
  });
});

interface TextFieldProps {
  value: string;
  label: string;
  name?: string;
  error?: string;
  onChange(value): void;
  onBlur(): void;
}

function TextField({
  label,
  name = label,
  onChange,
  onBlur,
  value,
  error,
}: TextFieldProps) {
  return (
    <>
      <label htmlFor={name}>
        {label}
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </label>
      {error && <p>{error}</p>}
    </>
  );
}

function fakeProduct(): SimpleProduct {
  return {
    title: faker.commerce.product(),
    description: faker.lorem.paragraph(),
    defaultVariant: {
      price: faker.commerce.price(),
      optionName: 'material',
      optionValue: faker.commerce.productMaterial(),
    },
    variants: Array.from({length: 2}).map(() => ({
      id: faker.random.uuid(),
      price: faker.commerce.price(),
      optionName: faker.lorem.word(),
      optionValue: faker.commerce.productMaterial(),
    })),
  };
}

function clickEvent() {
  // we don't actually use these at all so it is ok to just return an empty object
  return {} as any;
}
