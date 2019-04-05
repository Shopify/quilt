import {join} from 'path';
import {GraphQLConfig, GraphQLProjectConfig} from 'graphql-config';
import {
  getGraphQLProjectForSchemaPath,
  getGraphQLProjectIncludedFilePaths,
  getGraphQLProjects,
  getGraphQLSchemaPaths,
} from '../src/config';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
  };
});
jest.mock('glob', () => jest.fn());

const existsSync: jest.Mock = require.requireMock('fs').existsSync;
const glob: jest.Mock = require.requireMock('glob');

const configPath = join(__dirname, '.graphqlconfig');

describe('getGraphQLProjects()', () => {
  it('returns all projects in a multi-project configuration', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: '',
        projects: {foo: {schemaPath: 'foo'}, bar: {schemaPath: 'bar'}},
      },
      configPath,
    );

    const projects = getGraphQLProjects(config);

    expect(projects).toHaveLength(2);
    expect(projects[0].projectName).toBe('foo');
    expect(projects[0].schemaPath).toBe(join(__dirname, 'foo'));
    expect(projects[1].projectName).toBe('bar');
    expect(projects[1].schemaPath).toBe(join(__dirname, 'bar'));
  });

  it('returns one project in a single project configuration', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: 'single',
      },
      configPath,
    );

    const projects = getGraphQLProjects(config);

    expect(projects).toHaveLength(1);
    expect(projects[0].schemaPath).toBe(join(__dirname, 'single'));
  });

  it('throws an error if no projects are defined', () => {
    const config = new GraphQLConfig({projects: {}} as any, configPath);

    expect(() => getGraphQLProjects(config)).toThrowError(
      /No projects defined/i,
    );
  });
});

describe('getGraphQLSchemaPaths()', () => {
  beforeEach(() => {
    existsSync.mockClear();
  });

  it('returns schemaPath for each project ', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: '',
        projects: {foo: {schemaPath: 'foo'}, bar: {schemaPath: 'bar'}},
      },
      configPath,
    );

    existsSync.mockImplementation(() => true);

    expect(getGraphQLSchemaPaths(config)).toEqual(
      expect.arrayContaining([join(__dirname, 'foo'), join(__dirname, 'bar')]),
    );
  });
});

describe('getGraphQLProjectIncludedFilePaths()', () => {
  beforeEach(() => {
    glob.mockClear();
  });

  it('joins all file paths from each included pattern', async () => {
    const projectConfig = new GraphQLProjectConfig(
      {
        schemaPath: 'test',
        includes: ['app/A/**/*', 'app/B/**/*'],
        excludes: ['**/excluded'],
      },
      configPath,
    );

    // eslint-disable-next-line no-empty-pattern
    glob.mockImplementationOnce(({}, {}, cb) => cb(null, ['fileA']));
    // eslint-disable-next-line no-empty-pattern
    glob.mockImplementationOnce(({}, {}, cb) => cb(null, ['fileB']));

    const filePaths = await getGraphQLProjectIncludedFilePaths(projectConfig);

    expect(filePaths).toHaveLength(2);
    expect(filePaths).toEqual(expect.arrayContaining(['fileA', 'fileB']));

    expect(glob).toHaveBeenCalledTimes(2);
    expect(glob.mock.calls).toEqual(
      expect.arrayContaining([
        [
          join(__dirname, 'app/A/**/*'),
          {
            ignore: [join(__dirname, '**/excluded')],
          },
          expect.any(Function),
        ],
        [
          join(__dirname, 'app/B/**/*'),
          {
            ignore: [join(__dirname, '**/excluded')],
          },
          expect.any(Function),
        ],
      ]),
    );
  });
});

describe('getGraphQLProjectForSchemaPath()', () => {
  it('returns the correct schema in a multi-project configuration', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: '',
        projects: {foo: {schemaPath: 'foo'}},
      },
      configPath,
    );

    const projectConfig = getGraphQLProjectForSchemaPath(
      config,
      join(__dirname, 'foo'),
    );

    expect(projectConfig.schemaPath).toBe(join(__dirname, 'foo'));
  });

  it('returns the correct schema in a single project configuration', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: 'foo',
      },
      configPath,
    );

    const projectConfig = getGraphQLProjectForSchemaPath(
      config,
      join(__dirname, 'foo'),
    );

    expect(projectConfig.schemaPath).toBe(join(__dirname, 'foo'));
  });

  it('throws an error if the schemaPath does not match any project', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: 'foo',
      },
      configPath,
    );

    expect(() =>
      getGraphQLProjectForSchemaPath(config, join(__dirname, 'bar')),
    ).toThrowError(/No project defined/i);
  });
});
