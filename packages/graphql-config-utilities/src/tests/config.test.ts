import {join, resolve} from 'path';

import {
  GraphQLConfig,
  GraphQLProjectConfig,
  loadConfigSync,
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

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));
// jest.mock('glob', () => jest.fn());

const existsSync: jest.Mock = jest.requireMock('fs').existsSync;
// const glob: jest.Mock = jest.requireMock('glob');

const configPath = join(__dirname, '.graphqlconfig');

const projectConfig = loadConfigSync({
  filepath: resolve(__dirname, 'fixtures', 'project-one', '.graphqlconfig'),
});

const projectConfigMulti = loadConfigSync({
  filepath: resolve(__dirname, 'fixtures', 'project-multi', '.graphqlconfig'),
});

const projectConfigDefault = loadConfigSync({
  filepath: resolve(__dirname, 'fixtures', 'default', '.graphqlconfig'),
});

const projectConfigError = loadConfigSync({
  filepath: resolve(__dirname, 'fixtures', 'error', '.graphqlconfig'),
});

describe('resolvePathRelativeToConfig()', () => {
  it('resolves a relative path', () => {
    expect(
      resolvePathRelativeToConfig(
        projectConfig.getProject('project-one'),
        'test',
      ),
    ).toBe(join(__dirname, './fixtures', 'project-one', 'test'));
  });

  it('resolves an absolute path', () => {
    expect(
      resolvePathRelativeToConfig(
        projectConfig.getProject('project-one'),
        '/test',
      ),
    ).toBe('/test');
  });
});

describe('resolveProjectName()', () => {
  it('resolves a named project name', () => {
    expect(resolveProjectName(projectConfig.getProject('project-one'))).toBe(
      'project-one',
    );
  });

  it('ignores the provided defaultName for a named project', () => {
    expect(
      resolveProjectName(projectConfig.getProject('project-one'), 'ignored'),
    ).toBe('project-one');
  });

  it('uses default projectName for a nameless project when defaultName is omitted', () => {
    expect(resolveProjectName(projectConfigDefault.getDefault())).toBe(
      'default',
    );
  });
});

describe('resolveSchemaPath()', () => {
  beforeEach(() => {
    existsSync.mockClear();
  });

  it('throws an error if the schemaPath is empty', () => {
    const errorProjectConfig = {
      ...projectConfigError.getDefault(),
    };
    delete errorProjectConfig.schema;
    expect(() => resolveSchemaPath(errorProjectConfig)).toThrow(
      /Missing GraphQL schemaPath/i,
    );
  });

  it('throws an error if the schemaPath does not exist', () => {
    existsSync.mockImplementation(() => false);

    expect(() =>
      resolveSchemaPath(projectConfig.getProject('project-one')),
    ).toThrow(/Schema not found/i);
  });

  it('returns the schemaPath if it exists', () => {
    existsSync.mockImplementation(() => true);
    const fullPath = `${projectConfig.getProject('project-one').dirpath}/${
      projectConfig.getProject('project-one').schema
    }`;
    expect(resolveSchemaPath(projectConfig.getProject('project-one'))).toBe(
      fullPath,
    );
    expect(existsSync).toHaveBeenCalledWith(fullPath);
  });

  it('returns the non-existent schemaPath when ignoreMissing is true', () => {
    existsSync.mockImplementation(() => false);
    const fakeProjectConfig = {
      ...projectConfig.getProject('project-one'),
    };
    fakeProjectConfig.schema = 'totally-fake-schema.gql';
    expect(resolveSchemaPath(fakeProjectConfig, true)).toBe(
      `${fakeProjectConfig.dirpath}/${fakeProjectConfig.schema}`,
    );
  });
});

describe('getGraphQLProjects()', () => {
  it('returns all projects in a multi-project configuration', () => {
    const projects = getGraphQLProjects(projectConfigMulti);

    expect(projects).toHaveLength(2);
    expect(projects[0].name).toBe('project-one');
    expect(projects[1].name).toBe('project-two');
  });

  it('returns one project in a single project configuration', () => {
    const projects = getGraphQLProjects(projectConfig);

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('project-one');
  });

  it('throws an error if no projects are defined', () => {
    const fakeGraphQLConfig = {
      ...projectConfig,
    };
    delete fakeGraphQLConfig.projects;
    expect(() => getGraphQLProjects(fakeGraphQLConfig)).toThrow(
      /No projects defined/i,
    );
  });
});

describe('getGraphQLSchemaPaths()', () => {
  beforeEach(() => {
    existsSync.mockClear();
  });

  it('returns schemaPath for each project', () => {
    existsSync.mockImplementation(() => true);

    expect(getGraphQLSchemaPaths(projectConfigMulti)).toStrictEqual(
      expect.arrayContaining([
        join(
          __dirname,
          'fixtures',
          'project-multi',
          'project-one',
          'schema.graphql',
        ),
        join(
          __dirname,
          'fixtures',
          'project-multi',
          'project-two',
          'schema.graphql',
        ),
      ]),
    );
  });
});

describe('getGraphQLProjectIncludedFilePaths()', () => {
  it('joins all file paths from each included pattern', async () => {
    const filePaths = await getGraphQLProjectIncludedFilePaths(
      projectConfig.getProject('project-one'),
    );

    expect(filePaths).toHaveLength(4);
    expect(filePaths).toStrictEqual(
      expect.arrayContaining([
        join(
          __dirname,
          'fixtures',
          'project-one',
          'documents',
          'Fragment.graphql',
        ),
        join(
          __dirname,
          'fixtures',
          'project-one',
          'documents',
          'Query.graphql',
        ),
        join(
          __dirname,
          'fixtures',
          'project-one',
          'new-documents',
          'Fragment.graphql',
        ),
        join(
          __dirname,
          'fixtures',
          'project-one',
          'new-documents',
          'Query.graphql',
        ),
      ]),
    );
  });
});

describe('getGraphQLProjectForSchemaPath()', () => {
  it('returns the schema in a multi-project configuration', () => {
    const graphqlProjectConfig = getGraphQLProjectForSchemaPath(
      projectConfigMulti,
      join(
        __dirname,
        'fixtures',
        'project-multi',
        'project-one/schema.graphql',
      ),
    );

    expect(graphqlProjectConfig.schema).toBe('project-one/schema.graphql');
  });

  it('returns the schema in a single project configuration', () => {
    const graphqlProjectConfig = getGraphQLProjectForSchemaPath(
      projectConfig,
      join(__dirname, 'fixtures', 'project-one/schema.graphql'),
    );

    expect(graphqlProjectConfig.schema).toBe('schema.graphql');
  });

  it('throws an error if the schemaPath does not match any project', () => {
    expect(() =>
      getGraphQLProjectForSchemaPath(projectConfigMulti, 'schema.graphql'),
    ).toThrow(/No project defined/i);
  });
});
