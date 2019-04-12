import * as React from 'react';

export default function useOnValueChange<T>(
  value: T,
  onChange: (value: T, oldValue: T) => void,
) {
  const tracked = React.useRef(value);
  const oldValue = tracked.current;

  if (value !== oldValue) {
    tracked.current = value;
    onChange(value, oldValue);
  }
}
