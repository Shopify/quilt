import React from 'react';

import {SubmitHandler} from '../../../../types';
import {notEmpty} from '../../../../validation';
import {useDynamicList, useField, useForm} from '../../..';

import {SimpleProduct, Variant} from './types';
import {TextField} from './TextField';

export function FormWithDynamicVariantList({
  data,
  onSubmit,
  makeCleanAfterSubmit,
}: {
  data: SimpleProduct;
  onSubmit?: SubmitHandler<Partial<SimpleProduct>>;
  makeCleanAfterSubmit?: boolean;
}) {
  const variantFactory = () => {
    return {
      id: Date.now().toString(),
      price: '',
      optionName: '',
      optionValue: '',
    };
  };

  const {
    fields: {title},
    dynamicLists: {variants},
    submit,
    submitting,
    dirty,
    reset,
    makeClean,
    submitErrors,
  } = useForm({
    fields: {
      title: useField({
        value: data.title,
        validates: notEmpty('Title is required!'),
      }),
    },
    dynamicLists: {
      variants: useDynamicList<Variant>(
        {
          list: data.variants,
          validates: {
            optionName: notEmpty('Option name is required!'),
          },
        },
        variantFactory,
      ),
    },
    onSubmit,
    makeCleanAfterSubmit,
  });

  return (
    <form onSubmit={submit}>
      {submitting && <p>loading...</p>}
      {submitErrors.length > 0 &&
        // eslint-disable-next-line react/no-array-index-key
        submitErrors.map(({message}, index) => <p key={index}>{message}</p>)}

      <fieldset>
        <TextField label="title" {...title} />
      </fieldset>
      {variants.fields.map(({price, optionName, optionValue, id}, index) => {
        return (
          <fieldset name="default-variant" key={id.value}>
            <TextField label="price" {...price} />
            <TextField label="option" {...optionName} />
            <TextField label="value" {...optionValue} />
            <button type="button" onClick={() => variants.removeItem(index)}>
              Remove item
            </button>
          </fieldset>
        );
      })}
      <button type="button" onClick={() => variants.addItem()}>
        Add item
      </button>
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
