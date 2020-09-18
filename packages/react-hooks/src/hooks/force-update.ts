import {useState, useCallback} from 'react';

export function useForceUpdate() {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
}
