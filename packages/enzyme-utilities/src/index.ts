import {act} from 'react-dom/test-utils';
import {ReactWrapper, CommonWrapper} from 'enzyme';
import {get} from 'lodash';

export type AnyWrapper =
  | ReactWrapper<any, any>
  | ReactWrapper<any, never>
  | CommonWrapper<any, any>
  | CommonWrapper<any, never>;

export function trigger(wrapper: AnyWrapper, keypath: string, ...args: any[]) {
  if (wrapper.length === 0) {
    throw new Error(
      [
        `You tried to trigger ${keypath} on a React wrapper with no matching nodes.`,
        'This generally happens because you have either filtered your React components incorrectly,',
        'or the component you are looking for is not rendered because of the props on your component,',
        'or there is some error during one of your component’s render methods.',
      ].join(' '),
    );
  }

  const props = wrapper.props();
  const callback = get(props, keypath);

  if (callback == null) {
    throw new Error(
      `No callback found at keypath '${keypath}'. Available props: ${Object.keys(
        props,
      ).join(', ')}`,
    );
  }

  let returnValue: any;

  const promise = act(() => {
    returnValue = callback(...args);

    // This condition checks the returned value is an actual Promise and returns it
    // to React’s `act()` call, otherwise we just want to return `undefined`
    if (isPromise(returnValue)) {
      return returnValue;
    }

    return (undefined as unknown) as Promise<void>;
  });

  updateRoot(wrapper);

  if (isPromise(returnValue)) {
    // `promise` here refer to the the `act` promise above.
    // Resolving this promise will never return the resolved value because how `act` is design.
    return Promise.resolve(promise).then(() => {
      updateRoot(wrapper);
      return returnValue;
    });
  }

  return returnValue;
}

function updateRoot(wrapper: AnyWrapper) {
  (wrapper as any).root().update();
}

export function findById(wrapper: ReactWrapper<any, any>, id: string) {
  return wrapper.find({id}).first();
}

function isPromise<T>(promise: T | Promise<T>): promise is Promise<T> {
  return (
    promise != null && typeof promise === 'object' && 'then' in (promise as any)
  );
}
