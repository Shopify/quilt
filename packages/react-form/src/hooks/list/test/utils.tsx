import faker from 'faker';
import React from 'react';

export interface Variant {
  price: string;
  optionName: string;
  optionValue: string;
}

export function TextField({
  name,
  label,
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

export function randomVariants(number: number): Variant[] {
  return Array.from({length: number}).map(() => ({
    price: faker.commerce.price(),
    optionName: 'material',
    optionValue: faker.commerce.productMaterial(),
  }));
}

export function changeEvent(
  value: string,
): React.ChangeEvent<HTMLInputElement> {
  return {target: {value}} as any;
}

export function alwaysFail(value) {
  return `I AM ERROR FOR {${value}}`;
}

export function clickEvent() {
  // we don't actually use these at all so it is ok to just return an empty object
  return {} as any;
}

interface TextFieldProps {
  name: string;
  value: string;
  label: string;
  error?: string;
  onChange(value): void;
  onBlur(): void;
}
