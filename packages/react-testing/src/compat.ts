import {act as oldAct} from 'react-dom/test-utils';

export const act: typeof oldAct = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {act} = require('react');
    return act ?? oldAct;
  } catch {
    return oldAct;
  }
})();
