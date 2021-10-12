import React from 'react';

import {SubmitHandler} from '../../../../types';
import {positiveNumericString, notEmpty} from '../../../../validation';
import {useList, useField, useForm} from '../../..';

import {SimpleProduct} from './types';
import {TextField} from './TextField';

export function ProductForm({
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

  const {submit, submitting, dirty, reset, makeClean, submitErrors} = useForm({
    fields: {title, description, defaultVariant, variants},
    onSubmit,
    makeCleanAfterSubmit,
  });

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
