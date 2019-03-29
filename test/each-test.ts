import addClosest from 'element-closest';

import './matchers';
import '../packages/react-testing/src/matchers';

import {destroyAll} from '../packages/react-testing/src/api';

if (typeof window !== 'undefined') {
  addClosest(window);
}

afterEach(() => {
  destroyAll();
});
