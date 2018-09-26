import {readFile, readJSON} from 'fs-extra';
import {resolve} from 'path';
import glob from 'glob';
import {Source, parse, concatAST, GraphQLSchema} from 'graphql';
import {getGraphQLConfig, GraphQLProjectConfig} from 'graphql-config';
import {getGraphQLFilePath, getGraphQLProjects} from 'graphql-tool-utilities';
import {compile} from 'graphql-tool-utilities/ast';
import {promisify} from 'util';

import {
  Fixture,
  Validation,
  validateFixture,
  getOperationForFixture,
  MissingOperationError,
  AmbiguousOperationNameError,
  GraphQLProjectAST,
} from './validate';

export interface Options {
  cwd: string;
}

export interface Evaluation extends Validation {
  scriptError?: Error;
}

export async function evaluateFixtures(
  fixturePaths: string[],
  {cwd}: Options,
): Promise<Evaluation[]> {
  const config = getGraphQLConfig(resolve(cwd));

  const projectASTCollection = await Promise.all(
    getGraphQLProjects(config).map(getOperationsForProject),
  );

  return runForEachFixture(fixturePaths, (fixture) =>
    evaluateFixture(fixture, projectASTCollection),
  );
}

async function getOperationsForProject(
  projectConfig: GraphQLProjectConfig,
): Promise<GraphQLProjectAST> {
  const operationPaths = (await Promise.all(
    projectConfig.includes.map((include) =>
      promisify(glob)(getGraphQLFilePath(projectConfig, include), {
        ignore: projectConfig.excludes.map((exclude) =>
          getGraphQLFilePath(projectConfig, exclude),
        ),
      }),
    ),
  )).flatMap((filePaths) => filePaths);

  const operationSources = await Promise.all(
    operationPaths.map(loadOperationSource),
  );

  const document = concatAST(
    operationSources.map((source) => {
      try {
        return parse(source);
      } catch (error) {
        throw new Error(
          `Error parsing '${source.name}':\n\n${error.message.replace(
            /Syntax Error.*?\(.*?\) /,
            '',
          )}`,
        );
      }
    }),
  );

  let schema: GraphQLSchema;

  try {
    schema = projectConfig.getSchema();
  } catch (error) {
    throw new Error(
      `Error parsing '${projectConfig.schemaPath}':\n\n${error.message.replace(
        /Syntax Error.*?\(.*?\) /,
        '',
      )}`,
    );
  }

  return {
    ast: compile(schema, document),
    config: projectConfig,
  };
}

async function loadOperationSource(filePath: string) {
  const body = await readFile(filePath, 'utf8');

  return new Source(body, filePath);
}

function runForEachFixture<T extends Partial<Evaluation>>(
  fixturePaths: string[],
  runner: (fixture: Fixture) => T,
): Promise<Evaluation[]> {
  return Promise.all(
    fixturePaths.map(async (fixturePath) => {
      try {
        const fixture = await readJSON(fixturePath);
        return {
          fixturePath,
          ...(runner({path: fixturePath, content: fixture}) as any),
        };
      } catch (error) {
        return {
          fixturePath,
          scriptError: error,
          validationErrors: [],
        };
      }
    }),
  );
}

function evaluateFixture(
  fixture: Fixture,
  projectASTCollection: GraphQLProjectAST[],
): Evaluation {
  try {
    const {
      operation,
      projectAST: {ast},
    } = getOperationForFixture(fixture, projectASTCollection);

    return validateFixture(fixture, ast, operation);
  } catch (error) {
    if (
      error instanceof MissingOperationError ||
      error instanceof AmbiguousOperationNameError
    ) {
      return {
        fixturePath: fixture.path,
        validationErrors: [error],
      };
    }

    throw error;
  }
}
