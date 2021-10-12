import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

export default function addComponentProps(
  props: {name: string; value: t.StringLiteral | t.Identifier}[],
  component: string,
) {
  return {
    JSXElement(path: traverse.NodePath<t.JSXElement>) {
      const {openingElement} = path.node;

      if (
        t.isJSXIdentifier(openingElement.name) &&
        openingElement.name.name === component
      ) {
        props.forEach((prop) => {
          const value = t.isStringLiteral(prop.value)
            ? prop.value
            : t.jsxExpressionContainer(prop.value);

          openingElement.attributes.push(
            t.jsxAttribute(t.jsxIdentifier(prop.name), value),
          );
        });
      }
    },
  };
}
