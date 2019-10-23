import * as traverse from '@babel/traverse';
import * as t from '@babel/types';
import {astFrom} from '../utilities';

export default function replaceJSXBody(parent: string, children: string) {
  const parentJsx = astFrom(parent);

  return {
    JSXElement(path: traverse.NodePath<t.JSXElement>) {
      if (
        t.isJSXIdentifier(path.node.openingElement.name) &&
        path.node.openingElement.name.name === children &&
        t.isJSXElement(path.parent) &&
        t.isJSXIdentifier(path.parent.openingElement.name) &&
        t.isExpressionStatement(parentJsx) &&
        t.isJSXElement(parentJsx.expression) &&
        t.isJSXIdentifier(parentJsx.expression.openingElement.name) &&
        path.parent.openingElement.name.name !==
          parentJsx.expression.openingElement.name.name
      ) {
        if (t.isJSXElement(parentJsx.expression)) {
          const node = parentJsx.expression;
          node.children = [path.node];

          path.replaceWith(node as any);
        }
      }
    },
  };
}
