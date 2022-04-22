export {Root} from './root';
export {Element} from './element';
export type {Node} from './types';
export * from './mount';
export * from './destroy';
export * from './toReactString';

// As of React 18, we must specifically tell React it is operating in a unit-test-like environment
// This enables the use of act() and ensures that warnings will be logged on unwrapped updates
// See: https://github.com/reactwg/react-18/discussions/102
// See: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
