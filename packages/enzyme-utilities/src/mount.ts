import {ReactElement} from 'react';
import {mount as enzymeMount, ReactWrapper, MountRendererProps} from 'enzyme';
import {addMountedWrapper} from './wrappers';

export function mount<P, S = any>(
  node: ReactElement<P>,
  options?: MountRendererProps,
): ReactWrapper<P, S> {
  const mounted = enzymeMount(node, options);
  addMountedWrapper(mounted);
  return mounted;
}
