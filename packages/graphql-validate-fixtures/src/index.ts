import {readFile, readJSON} from 'fs-extra';
import {isAbsolute, resolve} from 'path';
import {GraphQLSchema, buildClientSchema, Source, parse, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities/ast';

import validateFixtureAgainstAST, {Validation} from './validate';

export interface Options {
  fixturePaths: string[],
  operationPaths: string[],
  schemaPath: string,
}

export interface Evaluation {
  fixturePath: string,
  scriptError?: Error,
  validation?: Validation,
}

export async function evaluateFixtures({fixturePaths, operationPaths, schemaPath}: Options): Promise<Evaluation[]>  {
  let schema: GraphQLSchema;

  try {
    const schemaJSON = await readJSON(schemaPath, 'utf8');
    schema = buildClientSchema(schemaJSON.data);
  } catch (error) {
    throw new Error(`Error parsing '${schemaPath}':\n\n${error.message.replace(/Syntax Error GraphQL \(.*?\) /, '')}`);
  }
  
  const sources = await Promise.all(
    operationPaths.map(async (operationPath) => new Source(await readFile(operationPath, 'utf8'), operationPath))
  );
  const document = concatAST(sources.map((source) => {
    try {
      return parse(source);
    } catch (error) {
      throw new Error(`Error parsing '${source.name}':\n\n${error.message.replace(/Syntax Error.*?\(.*?\) /, '')}`);
    }
    
  }));
  const ast = compile(schema, document);

  return await Promise.all(
    fixturePaths.map(async (fixturePath) => {
      const finalPath = isAbsolute(fixturePath) ? fixturePath : resolve(fixturePath);
      
      try {
        const fixture = await readJSON(finalPath);
        return {
          fixturePath: finalPath,
          validation: validateFixtureAgainstAST({path: finalPath, content: fixture}, ast),
        };
      } catch (error) {
        return {
          fixturePath: finalPath,
          scriptError: error,
        }
      }
    })
  );
}
