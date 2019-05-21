import {
  matcherHint,
  printReceived,
  printExpected,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils';
import {Node} from './types';
import {assertIsNode, diffPropsForNode} from './utilities';

export function toHaveReactProps<Props>(
  this: jest.MatcherUtils,
  node: Node<Props>,
  props: Partial<Props>,
) {
  assertIsNode(node, {
    expectation: 'toHaveReactProps',
    isNot: this.isNot,
  });

  if (props == null || typeof props !== 'object') {
    return {
      pass: false,
      message: () =>
        `You passed ${
          props == null ? String(props) : `a ${typeof props}`
        } as props, but it must be an object.`,
    };
  }

  const pass = Object.keys(props).every(key =>
    this.equals(props[key], node.props[key]),
  );

  const message = pass
    ? () =>
        `${matcherHint('.not.toHaveReactProps', node.toString())}\n\n` +
        `Expected the React element:\n  ${receivedColor(node.toString())}\n` +
        `Not to have props:\n  ${printExpected(props)}\n` +
        `Received:\n  ${printReceived(node.props)}\n`
    : () => {
        const diffString = diffPropsForNode(node, props, {
          expand: this.expand,
        });

        return (
          `${matcherHint('.toHaveReactProps', node.toString())}\n\n` +
          `Expected the React element:\n  ${receivedColor(node.toString())}\n` +
          `To have props:\n  ${printExpected(props)}\n` +
          `Received:\n  ${printReceived(node.props)}\n${
            diffString ? `Difference:\n${diffString}\n` : ''
          }`
        );
      };

  return {pass, message};
}

export function toHaveReactDataProps(
  this: jest.MatcherUtils,
  node: Node<unknown>,
  data: {[key: string]: string},
) {
  return toHaveReactProps.call(this, node, data);
}
