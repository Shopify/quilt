import * as React from 'react';
import faker from 'faker';
import {mount} from 'enzyme';

import FormState from '..';
import {lastCallArgs} from './utilities';
import {Input, InputField} from './components';

describe('<FormState />', () => {
  it('passes form state into child function', () => {
    const renderPropSpy = jest.fn(() => null);

    mount(<FormState initialValues={{}}>{renderPropSpy}</FormState>);

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        fields: expect.any(Object),
        errors: [],
        dirty: false,
        valid: true,
        submitting: false,
        submit: expect.any(Function),
      }),
    );
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
          name: 'product',
        },
      });
    });
  });

  describe('onInitialValuesChange', () => {
    describe('default', () => {
      it('resets all field objects values to their initialValues when the prop is updated', () => {
        const renderPropSpy = jest.fn(() => null);
        const originalValues = {
          product: faker.commerce.productName(),
          price: faker.commerce.price(),
        };

        const form = mount(
          <FormState initialValues={originalValues}>{renderPropSpy}</FormState>,
        );

        const formDetails = lastCallArgs(renderPropSpy);
        formDetails.fields.product.onChange(faker.commerce.productName());
        formDetails.fields.price.onChange(faker.commerce.price());

        const otherProduct = faker.commerce.productName();
        form.setProps({
          initialValues: {price: originalValues.price, product: otherProduct},
        });

        const {fields} = lastCallArgs(renderPropSpy);
        expect(fields).toMatchObject({
          product: {
            value: otherProduct,
            initialValue: otherProduct,
            dirty: false,
          },
          price: {
            value: originalValues.price,
            initialValue: originalValues.price,
            dirty: false,
          },
        });
      });

      it('resets errors and dirty when the initialValues prop is updated', async () => {
        const renderPropSpy = jest.fn(() => null);
        const originalValues = {
          product: faker.commerce.productName(),
          price: faker.commerce.price(),
        };

        const form = mount(
          <FormState
            onSubmit={() => Promise.resolve([{message: 'bad'}])}
            initialValues={originalValues}
          >
            {renderPropSpy}
          </FormState>,
        );

        const formDetails = lastCallArgs(renderPropSpy);
        formDetails.fields.price.onChange(faker.commerce.price());
        formDetails.fields.price.onChange(faker.commerce.price());

        const {submit} = lastCallArgs(renderPropSpy);
        await submit();

        const otherProduct = faker.commerce.productName();
        form.setProps({
          initialValues: {price: originalValues.price, product: otherProduct},
        });

        const state = lastCallArgs(renderPropSpy);
        expect(state).toMatchObject({
          errors: [],
          dirty: false,
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

        form.setProps({validators: {}});

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

    describe('reset-where-changed', () => {
      it('resets only field objects with changed initialValues when the prop is updated', () => {
        const renderPropSpy = jest.fn(() => null);
        const originalValues = {
          product: faker.commerce.productName(),
          price: faker.commerce.price(),
        };

        const form = mount(
          <FormState
            initialValues={originalValues}
            onInitialValuesChange="reset-where-changed"
          >
            {renderPropSpy}
          </FormState>,
        );

        const formDetails = lastCallArgs(renderPropSpy);
        formDetails.fields.product.onChange(faker.commerce.productName());
        const changedPrice = faker.commerce.price();
        formDetails.fields.price.onChange(changedPrice);

        const otherProduct = faker.commerce.productName();
        form.setProps({
          initialValues: {price: originalValues.price, product: otherProduct},
        });

        const {fields} = lastCallArgs(renderPropSpy);
        expect(fields).toMatchObject({
          product: {
            value: otherProduct,
            initialValue: otherProduct,
            dirty: false,
          },
          price: {
            value: changedPrice,
            initialValue: originalValues.price,
            dirty: true,
          },
        });
      });

      it('does not reset errors when the initialValues prop is updated', async () => {
        const renderPropSpy = jest.fn(() => null);
        const originalValues = {
          product: faker.commerce.productName(),
          price: faker.commerce.price(),
        };

        const submitErrors = [
          {message: faker.lorem.sentences()},
          {message: faker.lorem.sentences()},
        ];

        function onSubmit() {
          return Promise.resolve(submitErrors);
        }

        const form = mount(
          <FormState
            onSubmit={onSubmit}
            initialValues={originalValues}
            onInitialValuesChange="reset-where-changed"
          >
            {renderPropSpy}
          </FormState>,
        );

        const formDetails = lastCallArgs(renderPropSpy);
        formDetails.fields.price.onChange(faker.commerce.price());
        formDetails.fields.price.onChange(faker.commerce.price());

        const {submit} = lastCallArgs(renderPropSpy);
        await submit();

        const otherProduct = faker.commerce.productName();

        form.setProps({
          initialValues: {price: originalValues.price, product: otherProduct},
        });

        const state = lastCallArgs(renderPropSpy);
        expect(state.errors).toBe(submitErrors);
      });
    });

    describe('ignore', () => {
      it('does not reset field objects when the initialValues prop is updated', () => {
        const renderPropSpy = jest.fn(() => null);
        const product = faker.commerce.productName();

        const form = mount(
          <FormState initialValues={{product}} onInitialValuesChange="ignore">
            {renderPropSpy}
          </FormState>,
        );

        const formDetails = lastCallArgs(renderPropSpy);
        const changedProduct = faker.commerce.productName();
        formDetails.fields.product.onChange(changedProduct);

        form.setProps({initialValues: {product: faker.commerce.productName()}});

        const {fields} = lastCallArgs(renderPropSpy);
        expect(fields).toMatchObject({
          product: {
            value: changedProduct,
            initialValue: product,
            dirty: true,
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

        form.setProps({validators: {}});

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
  });

  describe('reset()', () => {
    it('resets all fields to their initial values', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());

      const {reset} = lastCallArgs(renderPropSpy);
      reset();

      const {fields} = lastCallArgs(renderPropSpy);
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

    it("is set to false if every field's value is equal to its initialValue", () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const color = faker.commerce.color();

      mount(
        <FormState initialValues={{product, color}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      formDetails.fields.color.onChange(faker.commerce.color());
      formDetails.fields.product.onChange(product);
      formDetails.fields.color.onChange(color);

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(false);
    });

    it("is set to true if any field's value is not equal to its initialValue", () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const color = faker.commerce.color();

      mount(
        <FormState initialValues={{product, color}}>{renderPropSpy}</FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(true);
    });
  });

  describe('field onChange', () => {
    it('updates field.value', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      const otherProduct = faker.commerce.productName();
      formDetails.fields.product.onChange(otherProduct);

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.value).toBe(otherProduct);
    });

    it('does not change field.initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.initialValue).toBe(product);
    });

    it('sets field.dirty to true if the new value is different from initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(true);
    });

    it('sets field.dirty to false if the new value is the same as initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });

    it('sets global dirty to true if the new value is different from initialValue', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      mount(<FormState initialValues={{product}}>{renderPropSpy}</FormState>);

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());

      const {dirty} = lastCallArgs(renderPropSpy);
      expect(dirty).toBe(true);
    });

    it('sets global dirty to false if the new value is the same as initialValue and no other field is dirty', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const description = faker.lorem.words();

      mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });

    it('keeps global dirty true if the new value is the same as initialValue and another field is dirty', () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();
      const description = faker.lorem.words();

      mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);
      formDetails.fields.description.onChange(faker.lorem.words());

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.dirty).toBe(false);
    });
  });

  describe('validation', () => {
    it('runs validation when an onBlur() is called', () => {
      const renderPropSpy = jest.fn(() => null);
      const productValidatorSpy = jest.fn();
      const product = faker.commerce.productName();

      mount(
        <FormState
          initialValues={{
            product,
          }}
          validators={{product: productValidatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const newProduct = faker.commerce.productName();
      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(newProduct);
      formDetails.fields.product.onBlur();

      expect(productValidatorSpy).toHaveBeenCalledTimes(1);
      expect(productValidatorSpy).toBeCalledWith(newProduct, {
        product: {
          dirty: true,
          // eslint-disable-next-line no-undefined
          error: undefined,
          initialValue: product,
          value: newProduct,
        },
      });
    });

    it('skips validation on a field when its onBlur() is called and the form is not dirty', () => {
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

      mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          validators={{product: validatorSpy}}
        >
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.productName());
      formDetails.fields.product.onBlur();
      formDetails.fields.product.onChange(faker.commerce.productName());

      expect(validatorSpy).toHaveBeenCalledTimes(2);
    });

    it('sets field.error to the result of its validator', () => {
      const renderPropSpy = jest.fn(() => null);
      const error = faker.lorem.sentence();
      const validatorSpy = jest.fn(() => error);

      mount(
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

      formDetails.fields.product.onBlur();

      const updatedFormDetails = lastCallArgs(renderPropSpy);
      expect(updatedFormDetails.fields.product.error).toBe(error);
    });

    it('sets field.error to an array of the results of all its validators if an array is given', () => {
      const renderPropSpy = jest.fn(() => null);
      const error = faker.lorem.sentence();
      const otherError = faker.lorem.sentence();
      const validatorSpy = jest.fn(() => error);
      const otherValidatorSpy = jest.fn(() => otherError);

      mount(
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

      const otherProduct = faker.commerce.productName();
      formDetails.fields.product.onChange(otherProduct);

      expect(validatorSpy).not.toHaveBeenCalledTimes(2);
    });

    it('sets valid to false when any field fails validation', () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
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

      formDetails.fields.product.onBlur();
      formDetails.fields.sku.onBlur();

      const {valid} = lastCallArgs(renderPropSpy);
      expect(valid).toBe(false);
    });

    it('sets valid to true when every field passes validation', () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
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

      const {valid} = lastCallArgs(renderPropSpy);
      expect(valid).toBe(true);
    });
  });

  describe('field submit', () => {
    it('calls onSubmit() with the current formDetails, other than the submit function, when submit() is called', async () => {
      const renderPropSpy = jest.fn(() => null);
      const onSubmitSpy = jest.fn();
      const product = faker.commerce.productName();

      mount(
        <FormState initialValues={{product}} onSubmit={onSubmitSpy}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit, submitting, reset, ...formData} = lastCallArgs(
        renderPropSpy,
      );

      await submit();

      expect(onSubmitSpy).toHaveBeenLastCalledWith(
        expect.objectContaining(formData),
      );
    });

    it('re-renders with submitting true while waiting for the onSubmit promise to resolve/reject', () => {
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

    it('re-renders with submitting false when onSubmit promise resolves', async () => {
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

    it('updates errors when errors are returned from onSubmit promise', async () => {
      const renderPropSpy = jest.fn(() => null);
      const product = faker.commerce.productName();

      const submitErrors = [
        {message: faker.lorem.sentences()},
        {message: faker.lorem.sentences()},
      ];

      function onSubmit() {
        return Promise.resolve(submitErrors);
      }

      mount(
        <FormState initialValues={{product}} onSubmit={onSubmit}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();

      const {errors} = lastCallArgs(renderPropSpy);
      expect(errors).toEqual(errors);
    });

    it('propagates submit errors down to fields when the field array matches an existing field', async () => {
      const renderPropSpy = jest.fn(() => null);
      const message = faker.lorem.sentences();

      const submitErrors = [
        {
          field: ['product'],
          message,
        },
      ];

      function onSubmit() {
        return Promise.resolve(submitErrors);
      }

      mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          onSubmit={onSubmit}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.error).toBe(message);
    });

    it('clears submit errors when a subsequent submit is successful', async () => {
      const renderPropSpy = jest.fn(() => null);

      const submitErrors = [
        {
          message: faker.lorem.sentences(),
        },
      ];

      let shouldSucceed = false;
      function onSubmit() {
        if (shouldSucceed) {
          return [];
        }

        return Promise.resolve(submitErrors);
      }

      mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          onSubmit={onSubmit}
        >
          {renderPropSpy}
        </FormState>,
      );

      const failingState = lastCallArgs(renderPropSpy);
      await failingState.submit();

      shouldSucceed = true;
      const succeedingState = lastCallArgs(renderPropSpy);
      await succeedingState.submit();

      const {errors} = lastCallArgs(renderPropSpy);
      expect(errors).toHaveLength(0);
    });

    it('clears submit errors on fields when onChange is called', async () => {
      const renderPropSpy = jest.fn(() => null);
      const message = faker.lorem.sentences();

      const submitErrors = [
        {
          field: ['product'],
          message,
        },
      ];

      function onSubmit() {
        return Promise.resolve(submitErrors);
      }

      mount(
        <FormState
          initialValues={{product: faker.commerce.productName()}}
          onSubmit={onSubmit}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit, fields} = lastCallArgs(renderPropSpy);
      await submit();
      fields.product.onChange(faker.commerce.productName());

      const {fields: updatedFields} = lastCallArgs(renderPropSpy);
      expect(updatedFields.product.error).not.toBe(message);
    });

    it('does not error when component is unmounted before submit resolves', () => {
      const renderPropSpy = jest.fn(() => null);
      const onSubmitSpy = jest.fn();
      const product = faker.commerce.productName();

      const form = mount(
        <FormState initialValues={{product}} onSubmit={onSubmitSpy}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      const submissionPromise = submit();
      form.unmount();
      expect(async () => {
        await submissionPromise();
      }).not.toThrow();
    });

    it('does not update errors when component is unmounted before submit resolves', async () => {
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

      form.unmount();

      const {submit} = lastCallArgs(renderPropSpy);
      await submit();

      const {errors} = lastCallArgs(renderPropSpy);
      expect(errors).toEqual([]);
    });
  });

  describe('validateOnSubmit', () => {
    it('calls all validators on submit when validateOnSubmit is true', async () => {
      const renderPropSpy = jest.fn(() => null);
      const productValidatorSpy = jest.fn();
      const skuValidatorSpy = jest.fn();

      mount(
        <FormState
          validateOnSubmit
          initialValues={{
            product: faker.commerce.productName,
            sku: faker.commerce.sku,
          }}
          validators={{
            product: productValidatorSpy,
            sku: skuValidatorSpy,
          }}
          onSubmit={noop}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      await submit();

      expect(productValidatorSpy).toBeCalled();
      expect(skuValidatorSpy).toBeCalled();
    });

    it('does not call onSubmit when a validator fails and validateOnSubmit is true', async () => {
      const renderPropSpy = jest.fn(() => null);
      const submitSpy = jest.fn();

      mount(
        <FormState
          validateOnSubmit
          initialValues={{
            product: faker.commerce.productName,
          }}
          validators={{
            product() {
              return 'product bad';
            },
          }}
          onSubmit={submitSpy}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      await submit();

      expect(submitSpy).not.toBeCalled();
    });

    it('resets submitting state when validation on submit fails', async () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState
          validateOnSubmit
          initialValues={{
            product: faker.commerce.productName,
          }}
          validators={{
            product() {
              return 'product bad';
            },
          }}
          onSubmit={noop}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      await submit();

      const {submitting} = lastCallArgs(renderPropSpy);

      expect(submitting).toBe(false);
    });

    it('does not call any validators on submit when validateOnSubmit is false', async () => {
      const renderPropSpy = jest.fn(() => null);
      const productValidatorSpy = jest.fn();
      const skuValidatorSpy = jest.fn();

      mount(
        <FormState
          validateOnSubmit={false}
          initialValues={{
            product: faker.commerce.productName,
            sku: faker.commerce.sku,
          }}
          validators={{
            product: productValidatorSpy,
            sku: skuValidatorSpy,
          }}
          onSubmit={noop}
        >
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      await submit();

      expect(productValidatorSpy).not.toBeCalled();
      expect(skuValidatorSpy).not.toBeCalled();
    });
  });

  describe('submit event', () => {
    it('calls preventDefault on event if it exists', async () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState initialValues={{}} onSubmit={noop}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      const mockEvent = {
        preventDefault: jest.fn(),
      };
      await submit(mockEvent);

      expect(mockEvent.preventDefault).toBeCalled();
    });

    it('does not call preventDefault on event if was prevented', async () => {
      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState initialValues={{}} onSubmit={noop}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      const mockEvent = {
        preventDefault: jest.fn(),
        defaultPrevented: true,
      };
      await submit(mockEvent);

      expect(mockEvent.preventDefault).not.toBeCalled();
    });

    it('calls onSubmit if event with no preventDefault function is provided', async () => {
      const renderPropSpy = jest.fn(() => null);
      const onSubmitSpy = jest.fn();

      mount(
        <FormState initialValues={{}} onSubmit={onSubmitSpy}>
          {renderPropSpy}
        </FormState>,
      );

      const {submit} = lastCallArgs(renderPropSpy);

      const mockEvent = {};
      await submit(mockEvent);

      expect(onSubmitSpy).toBeCalled();
    });
  });

  describe('validateForm', () => {
    it('calls all validators', () => {
      const productValidatorSpy = jest.fn();
      const skuValidatorSpy = jest.fn();

      const form = mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName,
            sku: faker.commerce.sku,
          }}
          validators={{
            product: productValidatorSpy,
            sku: skuValidatorSpy,
          }}
          onSubmit={noop}
        >
          {() => <div />}
        </FormState>,
      );

      /*
        unfortunately enzyme doesn't invoke refs so we can't access the instance the
        way we would in real application code
      */
      (form.instance() as FormState<any>).validateForm();

      expect(productValidatorSpy).toBeCalled();
      expect(skuValidatorSpy).toBeCalled();
    });

    it('updates fields when a validator fails', async () => {
      const renderPropSpy = jest.fn(() => null);
      const error = 'bad';
      const productValidatorSpy = jest.fn(() => error);

      const form = mount(
        <FormState
          initialValues={{
            product: faker.commerce.productName,
          }}
          validators={{
            product: productValidatorSpy,
          }}
          onSubmit={noop}
        >
          {renderPropSpy}
        </FormState>,
      );

      /*
        unfortunately enzyme doesn't invoke refs so we can't access the instance the
        way we would in real application code
      */
      await (form.instance() as FormState<any>).validateForm();

      const {fields} = lastCallArgs(renderPropSpy);
      expect(fields.product.error).toBe(error);
    });
  });

  describe('performance', () => {
    it('does not re-render form when the new state after onChange is identical', () => {
      const product = faker.commerce.productName();
      const description = faker.lorem.words();

      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(product);

      expect(renderPropSpy).toHaveBeenCalledTimes(1);
    });

    it('only calls the children render-prop once on mount', () => {
      const product = faker.commerce.productName();
      const description = faker.lorem.words();
      const renderPropSpy = jest.fn(() => null);

      mount(
        <FormState initialValues={{product, description}}>
          {renderPropSpy}
        </FormState>,
      );

      expect(renderPropSpy).toHaveBeenCalledTimes(1);
    });

    it('does not cause PureComponents to re-render when splatting the field object and a different field is changed', () => {
      const onRenderSpy = jest.fn();
      const product = faker.commerce.productName();

      const renderPropSpy = jest.fn(({fields}) => (
        <>
          <Input {...fields.description} onRender={onRenderSpy} />
          <Input {...fields.product} />
        </>
      ));

      mount(
        <FormState initialValues={{product, description: ''}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.product());

      expect(renderPropSpy).toHaveBeenCalledTimes(2);
      expect(onRenderSpy).toHaveBeenCalledTimes(1);
    });

    it('does not cause PureComponents to re-render when passing down the entire field object and a different field is changed', () => {
      const onRenderSpy = jest.fn();
      const product = faker.commerce.productName();

      const renderPropSpy = jest.fn(({fields}) => (
        <>
          <InputField field={fields.description} onRender={onRenderSpy} />
          <InputField field={fields.product} />
        </>
      ));

      mount(
        <FormState initialValues={{product, description: ''}}>
          {renderPropSpy}
        </FormState>,
      );

      const formDetails = lastCallArgs(renderPropSpy);
      formDetails.fields.product.onChange(faker.commerce.product());

      expect(renderPropSpy).toHaveBeenCalledTimes(2);
      expect(onRenderSpy).toHaveBeenCalledTimes(1);
    });
  });
});

function noop() {}
