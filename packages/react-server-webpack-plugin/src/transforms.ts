import * as t from '@babel/types';

export function fillCallExpressionOptions(
  name: string,
  options: Record<string, string | number>,
) {
  return {
    CallExpression(path) {
      if (!path.node.callee || path.node.callee.name !== name) {
        return;
      }

      const newProperties = Object.entries(options).map(
        ([key, value]: [string, string]) => {
          return t.objectProperty(t.identifier(key), t.identifier(`${value}`));
        },
      );

      path.node.arguments[0] = t.objectExpression([
        ...path.node.arguments[0].properties,
        ...newProperties,
      ]);
    },
  };
}
