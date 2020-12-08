import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

export default function addVariableDeclaratorProps(prop: string) {
  return {
    VariableDeclaration(path: traverse.NodePath<t.VariableDeclaration>) {
      const propsDeclaration = path.node.declarations.find(
        declaration =>
          (t.isVariableDeclarator(declaration) &&
            declaration.init &&
            t.isMemberExpression(declaration.init) &&
            (declaration.init.property as t.Identifier).name === 'props') ||
          false,
      );

      if (!propsDeclaration || !t.isObjectPattern(propsDeclaration.id)) {
        return;
      }

      if (t.isObjectPattern(propsDeclaration.id)) {
        propsDeclaration.id.properties.push(
          t.objectProperty(t.identifier(prop), t.identifier(prop), false, true),
        );
      }
    },
  };
}
