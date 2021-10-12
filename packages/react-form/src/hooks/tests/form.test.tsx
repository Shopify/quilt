import React from 'react';
import {mount} from '@shopify/react-testing';

import {submitSuccess, submitFail} from '..';

import {
  ProductForm,
  TextField,
  isDirty,
  changeTitle,
  fakeProduct,
  hitSubmit,
  hitReset,
  hitClean,
  waitForSubmit,
} from './utilities';

describe('useForm', () => {
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
          <ProductForm data={fakeProduct()} makeCleanAfterSubmit />,
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
