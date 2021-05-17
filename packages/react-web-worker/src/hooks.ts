import {useEffect} from 'react';
import {terminate} from '@shopify/web-worker';
import {useLazyRef} from '@shopify/react-hooks';
import {NoInfer} from '@shopify/useful-types';

type WorkerCreator<Options extends any[], ReturnType> = (
  ...args: Options
) => ReturnType;

// comment
export function useWorker<ReturnType, Options extends any[]>(
  creator: WorkerCreator<Options, ReturnType>,
  ...args: NoInfer<Options>
) {
  const {current: worker} = useLazyRef(() => creator(...(args as any)));

  useEffect(() => {
    return () => {
      terminate(worker);
    };
  }, [worker]);

  return worker;
}
