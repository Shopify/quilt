import testRenderer, {ReactTestRenderer, act} from 'react-test-renderer';

import {Strategy} from '../types';

export function nativeStrategy(): ReturnType<Strategy> {
  let renderer!: ReactTestRenderer;

  return {
    adaptor: {
      act: act as any,
      mount(element) {
        renderer = testRenderer.create(element);
      },
      unmount() {
        renderer.unmount();
      },
    },
  };
}
