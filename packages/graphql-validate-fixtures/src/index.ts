import {readFile, readJSON} from 'fs-extra';
import {isAbsolute, resolve} from 'path';
import {GraphQLSchema, buildClientSchema, Source, parse, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities/ast';

import {
  validateFixtureAgainstAST,
  validateFixtureAgainstSchema,
  Validation,
  Fixture,
} from './validate';

export interface Paths {
  fixturePaths: string[],
  operationPaths?: string[],
  schemaPath: string,
}

export interface Options {
  schemaOnly?: boolean,
}

export interface Evaluation extends Validation {
  fixturePath: string,
  scriptError?: Error,
}

export async function evaluateFixtures({fixturePaths, operationPaths = [], schemaPath}: Paths, {schemaOnly = false}: Options = {}): Promise<Evaluation[]>  {
  let schema: GraphQLSchema;

  try {
    const schemaJSON = await readJSON(schemaPath, {encoding: 'utf8'});
    schema = buildClientSchema(schemaJSON.data);
  } catch (error) {
    throw new Error(`Error parsing '${schemaPath}':\n\n${error.message.replace(/Syntax Error GraphQL \(.*?\) /, '')}`);
  }

  if (schemaOnly) {
    return await runForEachFixture(fixturePaths, (fixture) => validateFixtureAgainstSchema(fixture, schema));
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

  return await runForEachFixture(fixturePaths, (fixture) => validateFixtureAgainstAST(fixture, ast))
}

function runForEachFixture<T extends Partial<Evaluation>>(fixturePaths: string[], runner: (fixture: Fixture) => T): Promise<Evaluation[]> {
  return Promise.all(
    fixturePaths.map(async (fixturePath) => {
      const finalPath = isAbsolute(fixturePath) ? fixturePath : resolve(fixturePath);
      
      try {
        const fixture = await readJSON(finalPath);
        return {
          fixturePath: finalPath,
          ...(runner({path: finalPath, content: fixture}) as any),
        };
      } catch (error) {
        return {
          fixturePath: finalPath,
          scriptError: error,
          validationErrors: [],
        }
      }
    })
  );
}
