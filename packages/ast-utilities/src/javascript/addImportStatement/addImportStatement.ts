import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

import {astFrom} from '../utilities';

export default function addImportStatement(statement: string | string[]) {
  const statements = Array.isArray(statement) ? statement : [statement];

  return {
    Program(path: traverse.NodePath<t.Program>) {
      statements.forEach((statement) => {
        const ast = astFrom(`${statement}
        `);

        if (!t.isImportDeclaration(ast)) {
          return;
        }

        path.node.body.unshift(ast);
      });
    },
    File(path: traverse.NodePath<t.Program>) {
      if (path.node.body.length === 0) {
        path.node.body = [...path.node.body, ...addImports(statements)];
      }
    },
  };
}

function addImports(statements: string[]) {
  return statements.map((statement) => {
    const ast = astFrom(`${statement}
    `);

    return ast!;
  });
}
