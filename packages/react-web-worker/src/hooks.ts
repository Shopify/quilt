import {useEffect} from 'react';
import {terminate, CreateWorkerOptions} from '@shopify/web-worker';
import {useLazyRef} from '@shopify/react-hooks';

export function useWorker<T>(
  creator: (options?: CreateWorkerOptions) => T,
  options?: CreateWorkerOptions,
) {
  const {current: worker} = useLazyRef(() => creator(options));

  useEffect(() => {
    return () => {
      terminate(worker);
    };
  }, [worker]);

  return worker;
}
