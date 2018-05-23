import {ReactElement} from 'react';
import {mount as enzymeMount, ReactWrapper, MountRendererProps} from 'enzyme';

export default function createMount(onMount: (ReactWrapper) => void) {
  return function mount<P, S = any>(
    node: ReactElement<P>,
    options?: MountRendererProps,
  ): ReactWrapper<P, S> {
    const mounted = enzymeMount(node, options);
    onMount(mounted);
    return mounted;
  };
}
