import React from 'react';
import faker from 'faker';
import {mount} from '@shopify/react-testing';

import {SubmitHandler} from '../../types';
import {positiveNumericString, notEmpty} from '../../validation';

import {useList, useField, useForm, submitSuccess, submitFail} from '..';

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
    makeCleanAfterSubmit,
  }: {
    data: SimpleProduct;
    onSubmit?: SubmitHandler<SimpleProduct>;
    makeCleanAfterSubmit?: boolean;
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

    const {submit, submitting, dirty, reset, makeClean, submitErrors} = useForm(
      {
        fields: {title, description, defaultVariant, variants},
        onSubmit: onSubmit as any,
        makeCleanAfterSubmit,
      },
    );

    return (
      <form onSubmit={submit}>
        {submitting && <p>loading...</p>}
        {submitErrors.length > 0 &&
          submitErrors.map(({message}) => <p key={message}>{message}</p>)}

        <fieldset>
          <TextField label="title" {...title} />
          <TextField label="description" {...description} />
        </fieldset>
        <fieldset name="default-variant">
          <TextField label="price" {...defaultVariant.price} />
          <TextField label="option" {...defaultVariant.optionName} />
          <TextField label="value" {...defaultVariant.optionValue} />
        </fieldset>
        {variants.map(({price, optionName, optionValue, id}) => {
          return (
            <fieldset name="default-variant" key={id.value}>
              <TextField label="price" {...price} />
              <TextField label="option" {...optionName} />
              <TextField label="value" {...optionValue} />
            </fieldset>
          );
        })}
        <button type="button" onClick={makeClean}>
          Clean
        </button>
        <button type="reset" disabled={!dirty} onClick={reset}>
          Reset
        </button>
        <button type="submit" disabled={!dirty} onClick={submit}>
          Submit
        </button>
      </form>
    );
  }

  function isDirty(wrapper) {
    try {
      expect(wrapper).toContainReactComponent('button', {
        type: 'reset',
        disabled: false,
      });
      expect(wrapper).toContainReactComponent('button', {
        type: 'submit',
        disabled: false,
      });
    } catch {
      return false;
    }
    return true;
  }

  function changeTitle(wrapper, newTitle) {
    wrapper.find(TextField, {label: 'title'})!.trigger('onChange', newTitle);
  }

  function hitSubmit(wrapper) {
    wrapper.find('button', {type: 'submit'})!.trigger('onClick', clickEvent());
  }

  async function waitForSubmit(wrapper, successPromise) {
    hitSubmit(wrapper);

    await wrapper.act(async () => {
      await successPromise;
    });
  }

  function hitReset(wrapper) {
    wrapper.find('button', {type: 'reset'})!.trigger('onClick', clickEvent());
  }

  function hitClean(wrapper) {
    wrapper.find('button', {type: 'button'})!.trigger('onClick', clickEvent());
  }

  describe('dirty state', () => {
    it('dirty state is false when no field has been changed', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      expect(isDirty(wrapper)).toBe(false);
    });

    it('dirty state is true when any field has been changed', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      changeTitle(wrapper, 'Floobogs, the shoe for ogres');

      expect(isDirty(wrapper)).toBe(true);
    });

    it("dirty state is false when a field is changed and then returned to it's starting value", () => {
      const product = fakeProduct();
      const wrapper = mount(<ProductForm data={product} />);

      changeTitle(wrapper, 'Floobogs, the shoe for ogres');
      changeTitle(wrapper, product.title);

      expect(isDirty(wrapper)).toBe(false);
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

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');
      hitSubmit(wrapper);

      expect(wrapper).toContainReactComponent('p', {
        children: 'loading...',
      });
    });

    it('sets submitting to false when submission ends', async () => {
      const promise = Promise.resolve(submitSuccess());
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');
      await waitForSubmit(wrapper, promise);

      expect(wrapper).not.toContainReactComponent('p', {
        children: 'loading...',
      });
    });

    it('validates all fields with their latest values before submitting and bails out if any fail', () => {
      const submitSpy = jest.fn(() => Promise.resolve(submitSuccess()));
      const product = {
        ...fakeProduct(),
        title: 'slorp',
      };
      const wrapper = mount(
        <ProductForm data={product} onSubmit={submitSpy} />,
      );

      changeTitle(wrapper, '');
      hitSubmit(wrapper);

      expect(submitSpy).not.toHaveBeenCalled();
      expect(wrapper).toContainReactComponent('p', {
        children: 'Title is required!',
      });
    });

    it('validates list fields with their latest values before submitting and bails out if any fail', () => {
      const submitSpy = jest.fn(() => Promise.resolve(submitSuccess()));
      const product = fakeProduct();
      const wrapper = mount(
        <ProductForm data={product} onSubmit={submitSpy} />,
      );

      wrapper
        .findAll(TextField, {label: 'price'})[1]
        .trigger('onChange', 'not a valid price');
      hitSubmit(wrapper);

      expect(submitSpy).not.toHaveBeenCalled();
      expect(wrapper).toContainReactComponent('p', {
        children: 'price must be a number',
      });
    });

    it('returns remote submission errors', async () => {
      const error = {message: 'The server hates it'};
      const promise = Promise.resolve(submitFail([error]));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      await waitForSubmit(wrapper, promise);

      expect(wrapper).toContainReactComponent('p', {
        children: error.message,
      });
    });

    it('propagates remote submission errors to matching fields', async () => {
      const errors = [
        {
          field: ['variants', '0', 'price'],
          message: 'The server hates your price',
        },
      ];
      const promise = Promise.resolve(submitFail(errors));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      await waitForSubmit(wrapper, promise);

      expect(wrapper).toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });

    it('ignores invalid field path when propagating remote submission errors', async () => {
      const errors = [
        {
          field: ['invalid'],
          message: 'The server hates your price',
        },
      ];
      const promise = Promise.resolve(submitFail(errors));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      await waitForSubmit(wrapper, promise);

      expect(wrapper).toContainReactComponent('p', {
        children: errors[0].message,
      });
      expect(wrapper).not.toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });

    it('does not create a new submit function on each render', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      const initialSubmitHandler = wrapper
        .find('button', {type: 'submit'})!
        .prop('onClick');

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');

      const newSubmitHandler = wrapper
        .find('button', {type: 'submit'})!
        .prop('onClick');

      expect(initialSubmitHandler).toBe(newSubmitHandler);
    });

    describe('makeCleanAfterSubmit', () => {
      it('does not undirty fields after successful submit by default', async () => {
        const promise = Promise.resolve(submitSuccess());
        const wrapper = mount(<ProductForm data={fakeProduct()} />);

        changeTitle(wrapper, 'tortoritos, the chip for turtles!');

        expect(isDirty(wrapper)).toBe(true);

        await waitForSubmit(wrapper, promise);

        expect(isDirty(wrapper)).toBe(true);
      });

      it('does undirty fields after successful submit if makeCleanAfterSubmit is true', async () => {
        const promise = Promise.resolve(submitSuccess());
        const wrapper = mount(
          <ProductForm data={fakeProduct()} makeCleanAfterSubmit />,
        );

        changeTitle(wrapper, 'tortoritos, the chip for turtles!');

        expect(isDirty(wrapper)).toBe(true);

        await waitForSubmit(wrapper, promise);

        expect(isDirty(wrapper)).toBe(false);
      });

      it('does not undirty fields after successful submit if makeCleanAfterSubmit is false', async () => {
        const promise = Promise.resolve(submitSuccess());
        const wrapper = mount(
          <ProductForm data={fakeProduct()} makeCleanAfterSubmit={false} />,
        );

        changeTitle(wrapper, 'tortoritos, the chip for turtles!');

        expect(isDirty(wrapper)).toBe(true);

        await waitForSubmit(wrapper, promise);

        expect(isDirty(wrapper)).toBe(true);
      });

      it('does not undirty fields after if makeCleanAfterSubmit is true but submit is unsuccessful', async () => {
        const promise = Promise.resolve(submitFail());
        const wrapper = mount(
          <ProductForm data={fakeProduct()} makeCleanAfterSubmit={false} />,
        );

        changeTitle(wrapper, '');

        expect(isDirty(wrapper)).toBe(true);

        await waitForSubmit(wrapper, promise);

        expect(isDirty(wrapper)).toBe(true);
      });
    });
  });

  describe('reset', () => {
    it('resets all fields', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);
      const newProduct = 'Submarine full of gnomes';

      changeTitle(wrapper, newProduct);
      hitReset(wrapper);

      expect(wrapper).not.toContainReactComponent(TextField, {
        value: newProduct,
      });
      expect(isDirty(wrapper)).toBe(false);
    });

    it('resets errors from previous submissions', async () => {
      const errors = [
        {
          field: ['variants', '0', 'price'],
          message: 'The server hates your price',
        },
      ];
      const promise = Promise.resolve(submitFail(errors));
      const wrapper = mount(
        <ProductForm data={fakeProduct()} onSubmit={() => promise} />,
      );

      await waitForSubmit(wrapper, promise);
      hitReset(wrapper);

      expect(wrapper).not.toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });

    it('does not create a new reset function on each render', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      const initialResetHandler = wrapper
        .find('button', {type: 'reset'})!
        .prop('onClick');

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');

      const newResetHandler = wrapper
        .find('button', {type: 'reset'})!
        .prop('onClick');

      expect(initialResetHandler).toBe(newResetHandler);
    });
  });

  describe('makeClean', () => {
    it(`cleans the form's dirty state`, () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);
      const newProduct = 'Submarine full of gnomes';

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');

      hitClean(wrapper);

      expect(isDirty(wrapper)).toBe(false);
    });

    it('does not create a new makeClean function on each render', () => {
      const wrapper = mount(<ProductForm data={fakeProduct()} />);

      const initialMakeCleanHandler = wrapper
        .find('button', {type: 'button'})!
        .prop('onClick');

      changeTitle(wrapper, 'tortoritos, the chip for turtles!');

      const newMakeCleanHandler = wrapper
        .find('button', {type: 'button'})!
        .prop('onClick');

      expect(initialMakeCleanHandler).toBe(newMakeCleanHandler);
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
