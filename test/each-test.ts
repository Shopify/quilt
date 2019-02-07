import './matchers';
import addClosest from 'element-closest';

if (typeof window !== 'undefined') {
  addClosest(window);
}
