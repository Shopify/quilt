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
        const existingSpecifiers = path.node.specifiers.reduce(
          (acc, specifier) => {
            if (t.isImportSpecifier(specifier)) {
              const imported = t.isIdentifier(specifier.imported)
                ? specifier.imported.name
                : specifier.imported;
              return [...acc, imported, specifier.local.name];
            }

            return acc;
          },
          [],
        );

        newSpecifiers
          .filter((specifier) =>
            existingSpecifiers ? !existingSpecifiers.includes(specifier) : true,
          )
          .forEach((specifier) => {
            path.node.specifiers.push(
              t.importSpecifier(
                t.identifier(specifier),
                t.identifier(specifier),
              ),
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
