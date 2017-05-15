import {readFile, readJSON} from 'fs-extra';
import {buildSchema, Source, parse, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities';

import validateFixtureAgainstAST, {Error} from './validate';

export {Error};

export interface Options {
  fixturePaths: string[],
  documentPaths: string[],
  schemaPath: string,
}

export async function evaluateFixtures({fixturePaths, documentPaths, schemaPath}: Options) {
  const schema = buildSchema(await readFile(schemaPath, 'utf8'));
  const sources = await Promise.all(
    documentPaths.map(async (documentPath) => new Source(await readFile(documentPath, 'utf8'), documentPath))
  );
  const document = concatAST(sources.map((source) => parse(source)));
  const ast = compile(schema, document);
  
  return await Promise.all(
    fixturePaths.map(async (fixturePath) => {
      const fixture = await readJSON(fixturePath);
      return {
        fixture: fixturePath,
        errors: validateFixtureAgainstAST({path: fixturePath, content: fixture}, ast),
      };
    })
  );
}
