import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

interface Options {
  noDuplicates: boolean;
}

export default function addComponentProps(
  props: {name: string; value: t.StringLiteral | t.Identifier}[],
  component: string,
  options: Options = {noDuplicates: true},
) {
  return {
    JSXElement(path: traverse.NodePath<t.JSXElement>) {
      const {openingElement} = path.node;

      if (
        t.isJSXIdentifier(openingElement.name) &&
        openingElement.name.name === component
      ) {
        const hasExistingProp = openingElement.attributes.filter((attr) =>
          Boolean(
            props.filter((prop) => {
              if (
                t.isJSXAttribute(attr) &&
                t.isJSXExpressionContainer(attr.value) &&
                t.isIdentifier(attr.value.expression) &&
                t.isIdentifier(prop.value)
              ) {
                return (
                  prop.name === attr.name.name &&
                  prop.value.name === attr.value.expression.name
                );
              }
            }).length,
          ),
        );

        if (options.noDuplicates && hasExistingProp.length) {
          return;
        }

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
