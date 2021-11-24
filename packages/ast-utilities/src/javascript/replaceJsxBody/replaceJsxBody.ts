import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

import {astFrom} from '../utilities';

export default function replaceJSXBody(parent: string, children: string) {
  const newParentJsx = astFrom(parent);

  return {
    JSXElement(path: traverse.NodePath<t.JSXElement>) {
      const oldParentName =
        t.isJSXElement(path.parent) &&
        t.isJSXIdentifier(path.parent.openingElement.name) &&
        path.parent.openingElement.name.name;

      const newParentName =
        t.isExpressionStatement(newParentJsx) &&
        t.isJSXElement(newParentJsx.expression) &&
        t.isJSXIdentifier(newParentJsx.expression.openingElement.name) &&
        newParentJsx.expression.openingElement.name.name;

      const nodeName =
        t.isJSXIdentifier(path.node.openingElement.name) &&
        path.node.openingElement.name.name;

      if (
        nodeName === children &&
        newParentName !== nodeName &&
        (!oldParentName || newParentName !== oldParentName)
      ) {
        if (
          t.isExpressionStatement(newParentJsx) &&
          t.isJSXElement(newParentJsx.expression)
        ) {
          const newNode = newParentJsx.expression;
          newNode.children = [path.node];
          path.replaceWith(newNode);
        }
      }
    },
  };
}
