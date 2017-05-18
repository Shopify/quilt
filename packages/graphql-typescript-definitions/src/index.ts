import {writeFileSync} from 'fs-extra';
import {Operation, Fragment, AST} from 'graphql-tool-utilities/ast';

import buildAST, {Options} from './ast';
import {printFile} from './print';

export default function graphQLToTypeScriptDefinitions(options: Options) {
  const ast = buildAST(options);
  const fileMap = groupQueriesAndFragmentsByFile(ast);

  Object.keys(fileMap).forEach((path) => {
    const file = fileMap[path];

    const content = printFile(file, ast);
    if (!content) { return; }

    const newFile = `${file.path}.d.ts`;
    writeFileSync(newFile, content);
  });
}

interface File {
  path: string,
  operation?: Operation,
  fragment?: Fragment,
}

interface FileMap {
  [key: string]: File,
}

function groupQueriesAndFragmentsByFile({operations, fragments}: AST): FileMap {
  const map: FileMap = {};

  Object
    .keys(operations)
    .forEach((name) => {
      const operation = operations[name];
      map[operation.filePath] = {
        path: operation.filePath,
        operation,
      };
    });
  
  Object
    .keys(fragments)
    .forEach((name) => {
      const fragment = fragments[name];
      map[fragment.filePath] = {
        path: fragment.filePath,
        fragment,
      };
    });
  
  return map;
}
