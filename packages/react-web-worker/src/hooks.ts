import {useEffect} from 'react';
import {useLazyRef} from '@shopify/react-hooks';

export function useWorker<T>(creator: () => T) {
  const {current: worker} = useLazyRef(creator);

  useEffect(() => {
    return () => {
      // terminate(worker);
    };
  }, [worker]);

  return worker;
}
