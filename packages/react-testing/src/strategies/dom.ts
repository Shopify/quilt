import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {Strategy} from '../types';

export function domStrategy(): ReturnType<Strategy> {
  const container = document.createElement('div');

  return {
    adaptor: {
      act: act as any,
      mount(element) {
        document.body.appendChild(container);
        render(element, container);
      },
      unmount() {
        unmountComponentAtNode(container);
        container.remove();
      },
    },
  };
}
