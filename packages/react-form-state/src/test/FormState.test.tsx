import React from 'react';
import faker from 'faker';
import {mount} from 'enzyme';
import FormState from '..';

const ARBITRARY_SEED = 1337;

describe('<FormState />', () => {
  beforeEach(() => {
    faker.seed(ARBITRARY_SEED);
  });

  it('passes form state into child function', () => {
    const renderPropSpy = jest.fn(() => null);

    mount(<FormState initialValues={{}}>{renderPropSpy}</FormState>);

    const args = renderPropSpy.mock.calls[0][0];
    expect(args).toHaveProperty('fields');
    expect(args).toHaveProperty('errors');
    expect(args).toHaveProperty('dirty');
    expect(args).toHaveProperty('valid');
    expect(args).toHaveProperty('submitting');
    expect(args).toHaveProperty('submit');
  });

  describe('initialValues', () => {
    it('bases initial field objects passed into render prop on initialValues', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields).toMatchObject({
        product: {
          value: product,
          initialValue: product,
          dirty: false,
        },
      });
    });

    it('resets field objects values to new initialValues when prop is updated', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const otherProduct = faker.commerce.productName();
      form.setProps({initialValues: {product: otherProduct}});
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields).toMatchObject({
        product: {
          value: otherProduct,
          initialValue: otherProduct,
          dirty: false,
        },
      });
    });

    it('does not reset field objects values when non-initialValues props are updated', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      const otherProduct = faker.commerce.productName();
      formDetails.fields.product.onChange(otherProduct);
      form.update();

      form.setProps({validators: {}});
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields).toMatchObject({
        product: {
          value: otherProduct,
          initialValue: product,
          dirty: true,
        },
      });
    });
  });

  describe('reset()', () => {
    it('resets all fields to their initial values', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const {reset} = lastCallArgs(renderPropSpy);
      reset();

      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      reset();
      expect(fields).toMatchObject({
        product: {
          value: product,
          initialValue: product,
          dirty: false,
        },
      });
    });
  });

  describe('dirty', () => {
    it('defaults to false', () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName(),
            color: faker.commerce.productName(),
          }}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {dirty} = lastCallArgs(renderPropSpy);

      expect(dirty).toBe(false);
    });

    it("is set to false if every field's value is equal to it's initialValue", () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const color = faker.commerce.color();

      const form = mount(
        <FormState initialValues={{product, color}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      formDetails.fields.color.onChange(faker.commerce.color());
      form.update();

      formDetails.fields.product.onChange(product);
      formDetails.fields.color.onChange(color);
      form.update();

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(false);
    });

    it("is set to true if any field's value is not equal to it's initialValue", () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const color = faker.commerce.color();

      const form = mount(
        <FormState initialValues={{product, color}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(true);
    });
  });

  describe('field onChange', () => {
    it('updates field.value', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      const otherProduct = faker.commerce.productName();
      formDetails.fields.product.onChange(otherProduct);
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.value).toBe(otherProduct);
    });

    it('does not change field.initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.initialValue).toBe(product);
    });

    it('sets field.dirty to true if the new value is different from initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(true);
    });

    it('sets field.dirty to false if the new value is the same as initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });

    it('sets global dirty to true if the new value is different from initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(true);
    });

    it('sets global dirty to false if the new value is the same as initialValue and no other field is dirty', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const description = faker.lorem.words();

      const form = mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });

    it('keeps global dirty true if the new value is the same as initialValue and another field is dirty', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const description = faker.lorem.words();

      const form = mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();
      formDetails.fields.description.onChange(faker.lorem.words());
      form.update();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });
  });

  describe('validation', () => {
    it('runs validation when an onBlur() is called', () => {
      const renderPropSpy = jest.fn(() => null);
      const productValidatorSpy = jest.fn();

      const form = mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName(),
          }}
          validators={{product: productValidatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const product = faker.commerce.productName();
      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();

      formDetails.fields.product.onBlur();

      expect(productValidatorSpy).toBeCalledWith(product, {
        product: {
          dirty: true,
          // eslint-disable-next-line no-undefined
          error: undefined,
          initialValue: 'Gorgeous Rubber Keyboard',
          value: 'Intelligent Plastic Towels',
        },
      });
    });

    it("skips validation on a field when it's onBlur() is called and the form is not dirty", () => {
      const renderPropSpy = jest.fn(() => null);
      const validatorSpy = jest.fn();

      mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: validatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onBlur();

      expect(validatorSpy).not.toBeCalled();
    });

    it('runs validation on a field when it already has an error and onChange() is called', () => {
      const renderPropSpy = jest.fn(() => null);
      const validatorSpy = jest.fn(() => faker.lorem.sentence());

      const form = mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: validatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      formDetails.fields.product.onBlur();
      form.update();

      formDetails.fields.product.onChange(faker.commerce.productName());
      form.update();

      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });

    it("sets field.error to the result of it's validator", () => {
      const renderPropSpy = jest.fn(() => null);
      const error = faker.lorem.sentence();
      const validatorSpy = jest.fn(() => error);

      const form = mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: validatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const product = faker.commerce.productName();
      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();

      formDetails.fields.product.onBlur();

      const updatedFormDetails = lastCallArgs(renderPropSpy);
      expect(updatedFormDetails.fields.product.error).toBe(error);
    });

    it("sets field.error to an array of the results of all it's validators if an array is given", () => {
      const renderPropSpy = jest.fn(() => null);
      const error = faker.lorem.sentence();
      const otherError = faker.lorem.sentence();
      const validatorSpy = jest.fn(() => error);
      const otherValidatorSpy = jest.fn(() => otherError);

      const form = mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: [validatorSpy, otherValidatorSpy]}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const product = faker.commerce.productName();
      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      form.update();

      formDetails.fields.product.onBlur();

      const updatedFormDetails = lastCallArgs(renderPropSpy);
      expect(updatedFormDetails.fields.product.error).toEqual([
        error,
        otherError,
      ]);
    });

    it('does not run validation on a field when it has no error and onChange() is called', () => {
      const renderPropSpy = jest.fn(() => null);
      const validatorSpy = jest.fn();

      const form = mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: validatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onBlur();
      form.update();

      const otherProduct = faker.commerce.productName();
      formDetails.fields.product.onChange(otherProduct);
      form.update();

      expect(validatorSpy).not.toHaveBeenCalledTimes(2);
    });

    it('sets valid to false when any field fails validation', () => {
      const renderPropSpy = jest.fn(() => null);

      const form = mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName(),
            sku: faker.random.uuid(),
          }}
          validators={{
            // eslint-disable-next-line no-undefined
            product: () => undefined,
            sku: () => faker.lorem.sentence(),
          }}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      formDetails.fields.sku.onChange(faker.commerce.product());
      form.update();

      formDetails.fields.product.onBlur();
      formDetails.fields.sku.onBlur();
      form.update();

      const {valid} = lastCallArgs(renderPropSpy);
      expect(valid).toBe(false);
    });

    it('sets valid to true when every field passes validation', () => {
      const renderPropSpy = jest.fn(() => null);

      const form = mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName(),
            sku: faker.random.uuid(),
          }}
          validators={{
            // eslint-disable-next-line no-undefined
            product: () => undefined,
            // eslint-disable-next-line no-undefined
            sku: () => undefined,
          }}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onBlur();
      formDetails.fields.sku.onBlur();
      form.update();

      const {valid} = lastCallArgs(renderPropSpy);
      expect(valid).toBe(true);
    });
  });

  describe('field submit', () => {
    it('calls onSubmit() with the current field state when submit() is called', () => {
      const renderPropSpy = jest.fn(() => null);
      const onSubmitSpy = jest.fn();
      const product = faker.commerce.productName();

      mount(
        <FormState initialValues={{product}} onSubmit={onSubmitSpy}>
          {renderPropSpy}
        </FormState>,
      );

      const {fields, submit} = lastCallArgs(renderPropSpy);
      submit();

      expect(lastCallArgs(onSubmitSpy)).toMatchObject({
        product: {
          value: fields.product.value,
          initialValue: fields.product.initialValue,
          dirty: false,
        },
      });
    });

    it('when onSubmit() returns a promise, rerenders with submitting true while waiting for it to resolve/reject', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      function onSubmit() {
        return Promise.resolve();
      }

      mount(
        <FormState initialValues={{product}} onSubmit={onSubmit}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      submit();

      const {submitting} = lastCallArgs(renderPropSpy);
      expect(submitting).toBe(true);
    });

    it('when onSubmit() returns a promise, rerenders with submitting false when promise resolves', async () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      function onSubmit() {
        return Promise.resolve();
      }

      mount(
        <FormState initialValues={{product}} onSubmit={onSubmit}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();

      const {submitting} = lastCallArgs(renderPropSpy);
      expect(submitting).toBe(false);
    });

    it('updates errors when errors are returned from onSubmit', async () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const submitErrors = [
        {message: faker.lorem.sentences()},
        {message: faker.lorem.sentences()},
      ];

      function onSubmit() {
        return Promise.resolve(submitErrors);
      }

      const form = mount(
        <FormState initialValues={{product}} onSubmit={onSubmit}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();
      form.update();

      const {errors} = lastCallArgs(renderPropSpy);
      expect(errors).toEqual(errors);
    });

    it('converts array values for error fields to keypaths', async () => {
      const renderPropSpy = jest.fn(() => null);

      const submitErrors = [
        {message: faker.lorem.sentences(), field: ['title', 'foo']},
        {message: faker.lorem.sentences(), field: ['description', 'bar']},
      ];

      function onSubmit() {
        return Promise.resolve(submitErrors);
      }

      const form = mount(
        <FormState initialValues={{}} onSubmit={onSubmit}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();
      form.update();

      const {
        errors: [titleError, descriptionError],
      } = lastCallArgs(renderPropSpy);

      expect(titleError.field).toEqual(submitErrors[0].field.join('.'));
      expect(titleError.message).toEqual(submitErrors[0].message);
      expect(descriptionError.field).toEqual(submitErrors[1].field.join('.'));
      expect(descriptionError.message).toEqual(submitErrors[1].message);
    });
  });
});

function lastCallArgs(spy: jest.Mock) {
  const calls = spy.mock.calls;
  return calls[calls.length - 1][0];
}
