import {
  diff,
  matcherErrorMessage,
  matcherHint,
  RECEIVED_COLOR as receivedColor,
  printWithType,
  printReceived,
  printExpected,
} from 'jest-matcher-utils';

import {Root} from '../root';
import {Element} from '../element';
import {Node} from '../types';

export function assertIsNode(
  node: unknown,
  {expectation, isNot}: {expectation: string; isNot: boolean},
) {
  if (node == null) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(`.${expectation}`, undefined, undefined, {isNot}),
        `${receivedColor(
          'received',
        )} value must be an @shopify/react-testing Root or Element object`,
        `Received ${receivedColor(
          'null',
        )}.\nThis usually means that your \`.findX\` method failed to find any matching elements.`,
      ),
    );
  }

  if (
    Array.isArray(node) &&
    node.length > 1 &&
    (node[0] instanceof Root || node[0] instanceof Element)
  ) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(`.${expectation}`, undefined, undefined, {isNot}),
        `${receivedColor(
          'received',
        )} value must be an @shopify/react-testing Root or Element object`,
        `Received an ${receivedColor(
          'array of Root or Element objects',
        )}.\nThis usually means that you passed in the result of \`.findAllX\`. Pass the result of \`.findX\` instead.`,
      ),
    );
  }

  if (!(node instanceof Root) && !(node instanceof Element)) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(`.${expectation}`, undefined, undefined, {isNot}),
        `${receivedColor(
          'received',
        )} value must be an @shopify/react-testing Root or Element object`,
        printWithType('Received', node, printReceived),
      ),
    );
  }
}

export function assertIsType(
  type: unknown,
  {expectation, isNot}: {expectation: string; isNot: boolean},
) {
  if (type == null) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(`.${expectation}`, undefined, undefined, {isNot}),
        `${receivedColor(
          'expected',
        )} value must be a string or a valid React component.`,
        printWithType('Expected', type, printExpected),
      ),
    );
  }
}

export function diffs(
  element: Array<Node<any>>,
  props: object,
  expand?: boolean,
) {
  return element.reduce<string>((diffs, element, index) => {
    const separator = index === 0 ? '' : '\n\n';

    return `${diffs}${separator}${normalizedDiff(element, props, {
      expand,
      showLegend: index === 0,
    })}`;
  }, '');
}

function normalizedDiff(
  element: Node<any>,
  props: object,
  {expand = false, showLegend = false},
) {
  const result =
    diffPropsForNode(element, props, {
      expand,
    }) || '';

  return showLegend ? result : result.split('\n\n')[1];
}

export function printType(type: string | React.ComponentType<any>) {
  if (typeof type === 'object' && '_context' in type) {
    const context = (type as any)._context;
    const componentName = type === context.Provider ? 'Provider' : 'Consumer';
    const displayName = context.displayName || 'Context';
    return `<${displayName}.${componentName} />`;
  }

  const displayName =
    typeof type === 'string'
      ? type
      : type.displayName || type.name || 'Component';

  return `<${displayName} />`;
}

export function diffPropsForNode(
  node: Node<any>,
  props: object,
  {expand = false},
) {
  return diff(props, getObjectSubset(node.props, props), {
    expand,
  });
}

// Original from https://github.com/facebook/jest/blob/master/packages/expect/src/utils.ts#L107
function getObjectSubset(object: any, subset: any): any {
  if (Array.isArray(object)) {
    if (Array.isArray(subset) && subset.length === object.length) {
      return subset.map((sub: any, i: number) =>
        getObjectSubset(object[i], sub),
      );
    }
  } else if (object instanceof Date) {
    return object;
  } else if (
    typeof object === 'object' &&
    object !== null &&
    typeof subset === 'object' &&
    subset !== null
  ) {
    const trimmed: any = {};
    Object.keys(subset)
      .filter(key => Reflect.has(object, key))
      .forEach(
        key => (trimmed[key] = getObjectSubset(object[key], subset[key])),
      );

    if (Object.keys(trimmed).length > 0) {
      return trimmed;
    }
  }

  return object;
}

export function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}
