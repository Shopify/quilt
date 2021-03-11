import {join} from 'path';

import {
  GraphQLConfig,
  GraphQLConfigData,
  GraphQLProjectConfig,
} from 'graphql-config';

import {
  defaultGraphQLProjectName,
  getGraphQLProjectForSchemaPath,
  getGraphQLProjectIncludedFilePaths,
  getGraphQLProjects,
  getGraphQLSchemaPaths,
  resolvePathRelativeToConfig,
  resolveProjectName,
  resolveSchemaPath,
} from '../config';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
  };
});
jest.mock('glob', () => jest.fn());

const existsSync: jest.Mock = jest.requireMock('fs').existsSync;
const glob: jest.Mock = jest.requireMock('glob');

const configData: GraphQLConfigData = {schemaPath: 'test'};
const configPath = join(__dirname, '.graphqlconfig');

describe('resolvePathRelativeToConfig()', () => {
  it('resolves a relative path', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    expect(resolvePathRelativeToConfig(projectConfig, 'test')).toBe(
      join(__dirname, 'test'),
    );
  });

  it('resolves an absolute path', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    expect(resolvePathRelativeToConfig(projectConfig, '/test')).toBe('/test');
  });
});

describe('resolveProjectName()', () => {
  it('resolves a named project name', () => {
    const projectConfig = new GraphQLProjectConfig(
      configData,
      configPath,
      'test',
    );

    expect(resolveProjectName(projectConfig)).toBe('test');
  });

  it('ignores the provided defaultName for a named project', () => {
    const projectConfig = new GraphQLProjectConfig(
      configData,
      configPath,
      'test',
    );

    expect(resolveProjectName(projectConfig, 'ignored')).toBe('test');
  });

  it('uses the provided defaultName for a nameless project', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    expect(resolveProjectName(projectConfig, 'test')).toBe('test');
  });

  it('uses default projectName for a nameless project when defaultName is omitted', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    expect(resolveProjectName(projectConfig)).toBe(defaultGraphQLProjectName);
  });
});

describe('resolveSchemaPath()', () => {
  beforeEach(() => {
    existsSync.mockClear();
  });

  it('throws an error if the schemaPath is empty', () => {
    const projectConfig = new GraphQLProjectConfig({} as any, configPath);

    expect(() => resolveSchemaPath(projectConfig)).toThrow(
      /Missing GraphQL schemaPath/i,
    );
  });

  it('throws an error if the schemaPath does not exist', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    existsSync.mockImplementation(() => false);

    expect(() => resolveSchemaPath(projectConfig)).toThrow(/Schema not found/i);
  });

  it('returns the schemaPath if it exists', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    existsSync.mockImplementation(() => true);

    expect(resolveSchemaPath(projectConfig)).toBe(
      join(__dirname, configData.schemaPath),
    );
    expect(existsSync).toHaveBeenCalledWith(
      join(__dirname, configData.schemaPath),
    );
  });

  it('returns the non-existent schemaPath when ignoreMissing is true', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    existsSync.mockImplementation(() => false);

    expect(resolveSchemaPath(projectConfig, true)).toBe(
      join(__dirname, configData.schemaPath),
    );
  });
});

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

    expect(() => getGraphQLProjects(config)).toThrow(/No projects defined/i);
  });
});

describe('getGraphQLSchemaPaths()', () => {
  beforeEach(() => {
    existsSync.mockClear();
  });

  it('returns schemaPath for each project', () => {
    const config = new GraphQLConfig(
      {
        schemaPath: '',
        projects: {foo: {schemaPath: 'foo'}, bar: {schemaPath: 'bar'}},
      },
      configPath,
    );

    existsSync.mockImplementation(() => true);

    expect(getGraphQLSchemaPaths(config)).toStrictEqual(
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
    expect(filePaths).toStrictEqual(expect.arrayContaining(['fileA', 'fileB']));

    expect(glob).toHaveBeenCalledTimes(2);
    expect(glob.mock.calls).toStrictEqual(
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
  it('returns the schema in a multi-project configuration', () => {
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

  it('returns the schema in a single project configuration', () => {
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
    ).toThrow(/No project defined/i);
  });
});
