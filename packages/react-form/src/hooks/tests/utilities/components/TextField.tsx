import React from 'react';

interface TextFieldProps {
  value: string;
  label: string;
  name?: string;
  error?: string;
  onChange(value): void;
  onBlur(): void;
}

export function TextField({
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
