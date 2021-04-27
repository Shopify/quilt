import faker from 'faker';
import {Root} from '@shopify/react-testing';

import {SimpleProduct, TextField} from './components';

export * from './components';

export function isDirty(wrapper) {
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

export function changeTitle(wrapper, newTitle) {
  wrapper.find(TextField, {label: 'title'})!.trigger('onChange', newTitle);
}

export function hitSubmit(wrapper) {
  wrapper.find('button', {type: 'submit'})!.trigger('onClick', clickEvent());
}

export async function waitForSubmit(wrapper, successPromise) {
  hitSubmit(wrapper);

  await wrapper.act(async () => {
    await successPromise;
  });
}

export function hitReset(wrapper) {
  wrapper.find('button', {type: 'reset'})!.trigger('onClick', clickEvent());
}

export function hitClean(wrapper) {
  wrapper.find('button', {type: 'button'})!.trigger('onClick', clickEvent());
}

export function fakeProduct(): SimpleProduct {
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

export function clickEvent() {
  // we don't actually use these at all so it is ok to just return an empty object
  return {} as any;
}

export function fillRequiredFields(wrapper: Root<any>) {
  const optionTextFields = wrapper.findAll(TextField, {label: 'option'});
  optionTextFields.forEach(textField =>
    textField.trigger('onChange', 'a value'),
  );

  const titleTextFields = wrapper.findAll(TextField, {label: 'title'});
  titleTextFields.forEach(textField =>
    textField.trigger('onChange', 'a value'),
  );
}
