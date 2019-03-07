import * as React from 'react';
import {mount} from 'enzyme';

import Manager from '../../manager';
import {HtmlProvider} from '../../context';

export function mountWithManager(
  element: React.ReactElement<any>,
  manager: Manager,
) {
  return mount(<HtmlProvider manager={manager}>{element}</HtmlProvider>);
}
