import {resolve} from 'path';

import {readJSON} from 'fs-extra';
import type {GraphQLSchema} from 'graphql';
import {concatAST, parse, Source} from 'graphql';
import type {GraphQLProjectConfig} from 'graphql-config';
import {loadConfig} from 'graphql-config';
import {
  getGraphQLProjectIncludedFilePaths,
  getGraphQLProjects,
} from 'graphql-config-utilities';
import {compile} from 'graphql-tool-utilities';
import {loadFilesSync} from '@graphql-tools/load-files';

import type {Fixture, Validation, GraphQLProjectAST} from './validate';
import {
  validateFixture,
  getOperationForFixture,
  MissingOperationError,
  AmbiguousOperationNameError,
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
  const config = await loadConfig({
    rootDir: resolve(cwd),
  });

  if (!config) {
    return [];
  }

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
  const operationPaths = await getGraphQLProjectIncludedFilePaths(
    projectConfig,
  );

  const sanitizedSources = operationPaths.map((filePath: string) => {
    const file = loadFilesSync(filePath);

    if (!file || file.length === 0) {
      throw new Error(`Error loading '${filePath}'}`);
    }

    if (file[0].__esModule) {
      for (const key of Object.keys(file[0])) {
        if (Object.keys(file[0][key]).includes('kind')) {
          return new Source(file[0][key].loc.source.body, filePath);
        }
      }
    } else if (Object.keys(file[0]).includes('kind')) {
      return new Source(file[0].loc.source.body, filePath);
    }

    return new Source(file[0], filePath);
  });

  const document = concatAST(
    sanitizedSources.map((source: Source) => {
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
    schema = await projectConfig.getSchema();
  } catch (error) {
    throw new Error(
      `Error parsing '${projectConfig.schema}':\n\n${error.message.replace(
        /Syntax Error.*?\(.*?\) /,
        '',
      )}`,
    );
  }

  return {
    ast: compile(schema, document, {addTypename: true}),
    config: projectConfig,
  };
}

function runForEachFixture<T extends Partial<Evaluation>>(
  fixturePaths: string[],
  runner: (fixture: Fixture) => T,
): Promise<Evaluation[]> {
  return Promise.all(
    fixturePaths.map(async (fixturePath) => {
      try {
        const fixture = await readJSON(fixturePath);

        let fixtureContent = fixture;
        if (fixture.data) {
          fixtureContent = fixture.data;
        }

        return {
          fixturePath,
          ...(runner({path: fixturePath, content: fixtureContent}) as any),
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
