import * as traverse from '@babel/traverse';
import * as t from '@babel/types';
import {astFrom} from '../utilities';

export default function addImportSpecifier(
  importSource: string,
  newSpecifier: string | string[],
) {
  const newSpecifiers = Array.isArray(newSpecifier)
    ? newSpecifier
    : [newSpecifier];

  let added = false;

  return {
    ImportDeclaration(path: traverse.NodePath<t.ImportDeclaration>) {
      if (path.node.source.value === importSource) {
        newSpecifiers.forEach(specifier => {
          path.node.specifiers.push(
            t.importSpecifier(t.identifier(specifier), t.identifier(specifier)),
          );
        });
        added = true;
      }
    },
    Program: {
      exit(path: traverse.NodePath<t.Program>) {
        if (!added) {
          const ast = astFrom(
            `import {${newSpecifier}} from '${importSource}';`,
          );

          if (!t.isImportDeclaration(ast)) {
            return;
          }

          path.node.body.unshift(ast);
        }
      },
    },
  };
}
