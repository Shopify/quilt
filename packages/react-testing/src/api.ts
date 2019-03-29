import * as React from 'react';
import {Root, connected} from './root';
import {Element} from './element';

export {Root, Element};

export function mount<P>(element: React.ReactElement<P>) {
  return new Root<P>(element);
}

export function destroyAll() {
  for (const wrapper of [...connected]) {
    wrapper.destroy();
  }
}
