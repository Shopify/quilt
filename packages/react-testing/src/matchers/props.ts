import {
  matcherHint,
  printReceived,
  printExpected,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils';
import {Node} from './types';
import {assertIsNode, diffPropsForNode} from './utilities';

export function toHaveReactProp<Props>(
  this: jest.MatcherUtils,
  node: Node<Props>,
  prop: keyof Props,
  value?: unknown,
) {
  assertIsNode(node, {
    expectation: 'toHaveReactProp',
    isNot: this.isNot,
  });

  const valuePassed = arguments.length > 2;
  const hasProp = Reflect.has(node.props as any, prop);
  const pass = valuePassed ? this.equals(value, node.prop(prop)) : hasProp;

  const message = pass
    ? () =>
        `${matcherHint('.not.toHaveReactProp', node.toString(), 'prop', {
          secondArgument: valuePassed ? 'value' : undefined,
          isNot: true,
        })}\n\n` +
        `Expected the React element:\n  ${receivedColor(node.toString())}\n` +
        `Not to have prop:\n  ${printExpected(prop)}\n${
          valuePassed ? `With a value of\n  ${printExpected(value)}\n` : ''
        }` +
        `${
          valuePassed
            ? `But it does have a '${prop}' prop with that value.\n`
            : `But it does have a '${prop}' prop.\n`
        }`
    : () =>
        `${`${matcherHint('.toHaveReactProp', node.toString(), 'prop', {
          secondArgument: valuePassed ? 'value' : undefined,
        })}\n\n` +
          `Expected the React element:\n  ${receivedColor(node.toString())}\n` +
          `To have prop:\n  ${printExpected(prop)}\n${
            valuePassed ? `With a value of:\n  ${printExpected(value)}\n` : ''
          }`}${
          hasProp
            ? `Received:\n  ${printReceived(node.prop(prop))}\n`
            : `But it does not have a '${prop}' prop.\n`
        }`;

  return {pass, message};
}

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
