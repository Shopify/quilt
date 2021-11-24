import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

import {astFrom} from '../utilities';

export default function wrapJsxChildren(
  children: string,
  parentNodeName: string,
) {
  const newChildrenJsx = astFrom(children);

  return {
    JSXElement(path: traverse.NodePath<t.JSXElement>) {
      const oldParentName =
        t.isJSXElement(path.parent) &&
        t.isJSXIdentifier(path.parent.openingElement.name) &&
        path.parent.openingElement.name.name;

      const newChildName =
        t.isExpressionStatement(newChildrenJsx) &&
        t.isJSXElement(newChildrenJsx.expression) &&
        t.isJSXIdentifier(newChildrenJsx.expression.openingElement.name) &&
        newChildrenJsx.expression.openingElement.name.name;

      const nodeName =
        t.isJSXIdentifier(path.node.openingElement.name) &&
        path.node.openingElement.name.name;

      if (
        nodeName === parentNodeName &&
        newChildName !== nodeName &&
        (!oldParentName || newChildName !== oldParentName)
      ) {
        if (
          t.isExpressionStatement(newChildrenJsx) &&
          t.isJSXElement(newChildrenJsx.expression)
        ) {
          const newNode = newChildrenJsx.expression;
          newNode.children = path.node.children;
          path.node.children = [newNode];
        }
      }
    },
  };
}
