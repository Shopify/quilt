import * as React from 'react';
import {mount} from 'enzyme';

import Manager from '../../manager';
import {Provider} from '../../context';

export function mountWithManager(
  element: React.ReactElement<any>,
  manager: Manager,
) {
  return mount(<Provider manager={manager}>{element}</Provider>);
}
