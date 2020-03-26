import {useState, useEffect} from 'react';

export function useMedia<ValueType>(
  queries: string[],
  values: ValueType[],
  defaultValue: ValueType,
) {
  const mediaQueryLists = queries.map(query => {
    return window.matchMedia(query);
  });

  const getValue = () => {
    const index = mediaQueryLists.findIndex(mediaQueryList => {
      return mediaQueryList.matches;
    });
    return typeof values[index] === 'undefined' ? defaultValue : values[index];
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => {
      setValue(getValue);
    };
    mediaQueryLists.forEach(mediaQueryList => {
      mediaQueryList.addListener(handler);
    });
    return () => {
      mediaQueryLists.forEach(mediaQueryList => {
        mediaQueryList.removeListener(handler);
      });
    };
  }, []);

  return value;
}
