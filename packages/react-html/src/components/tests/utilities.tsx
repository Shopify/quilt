import React from 'react';
import {mount} from '@shopify/react-testing';

import type {HtmlManager} from '../../manager';
import {HtmlContext} from '../../context';

export function mountWithManager(
  element: React.ReactElement<any>,
  manager: HtmlManager,
) {
  return mount(
    <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>,
  );
}
