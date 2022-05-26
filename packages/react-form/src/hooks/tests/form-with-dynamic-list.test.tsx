import React from 'react';
import {mount} from '@shopify/react-testing';

import {submitSuccess, submitFail} from '..';

import {
  FormWithDynamicVariantList,
  TextField,
  isDirty,
  fakeProduct,
  hitSubmit,
  hitReset,
  waitForSubmit,
  clickEvent,
  fillRequiredFields,
} from './utilities';

describe('useForm with dynamic list', () => {
  describe('dirty state', () => {
    it('dirty state is false when no field has been changed', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      expect(isDirty(wrapper)).toBe(false);
    });

    it('dirty state is true when a new variant item has been added', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');

      expect(isDirty(wrapper)).toBe(true);
    });

    it('dirty state is true when a variant item has been removed', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper.find('button', {children: 'Remove item'})!.trigger('onClick');

      expect(isDirty(wrapper)).toBe(true);
    });

    it('dirty state is true when a variant item has been edited', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper
        .find(TextField, {label: 'price'})!
        .trigger('onChange', 'next price');

      expect(isDirty(wrapper)).toBe(true);
    });
  });

  describe('submit', () => {
    it('validates dynamic list fields with their latest values before submitting and bails out if any fail', async () => {
      const submitSpy = jest.fn(() => Promise.resolve(submitSuccess()));
      const product = fakeProduct();
      const wrapper = mount(
        <FormWithDynamicVariantList data={product} onSubmit={submitSpy} />,
      );

      const textFields = wrapper.findAll(TextField, {label: 'option'});

      textFields.forEach((textField) => textField.trigger('onChange', ''));
      await hitSubmit(wrapper);

      expect(submitSpy).not.toHaveBeenCalled();

      expect(wrapper).toContainReactComponentTimes(
        TextField,
        textFields.length,
        {
          error: 'Option name is required!',
        },
      );
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
        <FormWithDynamicVariantList
          data={fakeProduct()}
          onSubmit={() => promise}
        />,
      );

      await waitForSubmit(wrapper, promise);

      expect(wrapper).toContainReactComponent(TextField, {
        error: errors[0].message,
      });
    });
  });

  describe('reset', () => {
    it('reset dynamic list after adding new item', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');

      expect(wrapper).toContainReactComponentTimes(TextField, 3, {
        label: 'option',
      });

      hitReset(wrapper);

      expect(wrapper).toContainReactComponentTimes(TextField, 2, {
        label: 'option',
      });
      expect(isDirty(wrapper)).toBe(false);
    });

    it('reset dynamic list after removing item', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper.find('button', {children: 'Remove item'})!.trigger('onClick');

      expect(wrapper).toContainReactComponentTimes(TextField, 1, {
        label: 'option',
      });

      hitReset(wrapper);

      expect(wrapper).toContainReactComponentTimes(TextField, 2, {
        label: 'option',
      });
      expect(isDirty(wrapper)).toBe(false);
    });
  });

  describe('makeCleanAfterSubmit', () => {
    it('sets dirty to false after successful submit if makeCleanAfterSubmit is true', async () => {
      // eslint-disable-next-line promise/catch-or-return
      Promise.resolve(submitSuccess());
      const wrapper = mount(
        <FormWithDynamicVariantList
          data={fakeProduct()}
          makeCleanAfterSubmit
        />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');
      fillRequiredFields(wrapper);

      expect(isDirty(wrapper)).toBe(true);

      await wrapper
        .find('button', {type: 'submit'})!
        .trigger('onClick', clickEvent());
      expect(isDirty(wrapper)).toBe(false);
    });

    it('does not set dirty to false after successful submit if makeCleanAfterSubmit is false', async () => {
      const promise = Promise.resolve(submitSuccess());
      const wrapper = mount(
        <FormWithDynamicVariantList
          data={fakeProduct()}
          makeCleanAfterSubmit={false}
        />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');
      fillRequiredFields(wrapper);

      expect(isDirty(wrapper)).toBe(true);

      await waitForSubmit(wrapper, promise);

      expect(isDirty(wrapper)).toBe(true);
    });

    it('does not set dirty to false if makeCleanAfterSubmit is true but submit is unsuccessful', async () => {
      const promise = Promise.resolve(submitFail());
      const wrapper = mount(
        <FormWithDynamicVariantList
          data={fakeProduct()}
          makeCleanAfterSubmit={false}
        />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');
      fillRequiredFields(wrapper);

      expect(isDirty(wrapper)).toBe(true);

      await waitForSubmit(wrapper, promise);

      expect(isDirty(wrapper)).toBe(true);
    });
  });

  describe('makeClean', () => {
    it('cleans the forms dirty state', () => {
      const wrapper = mount(
        <FormWithDynamicVariantList data={fakeProduct()} />,
      );

      wrapper.find('button', {children: 'Add item'})!.trigger('onClick');
      fillRequiredFields(wrapper);

      expect(isDirty(wrapper)).toBe(true);

      wrapper
        .find('button', {children: 'Clean'})!
        .trigger('onClick', clickEvent());

      expect(isDirty(wrapper)).toBe(false);
    });
  });
});
