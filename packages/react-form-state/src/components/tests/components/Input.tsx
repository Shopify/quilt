import React, {InputHTMLAttributes} from 'react';

export interface Props {
  onChange(value: string): void;
}

export default function Input({
  onChange,
  ...inputProps
}: Props & InputHTMLAttributes<any>) {
  return (
    <input
      // eslint-disable-next-line react/jsx-no-bind
      onChange={({currentTarget}) => onChange(currentTarget.value)}
      {...inputProps}
    />
  );
}
