import {GraphQLConfigData, GraphQLProjectConfig} from 'graphql-config';
import {join} from 'path';
import {defaultGraphQLProjectName} from '../src/augmentations';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
  };
});

const existsSync: jest.Mock = require.requireMock('fs').existsSync;

describe('GraphQLProjectConfig', () => {
  const configData: GraphQLConfigData = {schemaPath: 'test'};
  const configPath = join(__dirname, '.graphqlconfig');

  describe('resolvePathRelativeToConfig()', () => {
    it('aliases foo', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      expect(projectConfig.resolvePathRelativeToConfig).toBe(
        projectConfig.resolveConfigPath,
      );
    });

    it('resolves a relative path', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      expect(projectConfig.resolvePathRelativeToConfig('test')).toBe(
        join(__dirname, 'test'),
      );
    });

    it('resolves an absolute path', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      expect(projectConfig.resolvePathRelativeToConfig('/test')).toBe('/test');
    });
  });

  describe('resolveProjectName()', () => {
    it('resolves a named project name', () => {
      const projectConfig = new GraphQLProjectConfig(
        configData,
        configPath,
        'test',
      );

      expect(projectConfig.resolveProjectName()).toBe('test');
    });

    it('ignores the provided defaultName for a named project', () => {
      const projectConfig = new GraphQLProjectConfig(
        configData,
        configPath,
        'test',
      );

      expect(projectConfig.resolveProjectName('ignored')).toBe('test');
    });

    it('uses the provided defaultName for a nameless project', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      expect(projectConfig.resolveProjectName('test')).toBe('test');
    });

    it('uses default projectName for a nameless project when defaultName is omitted', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      expect(projectConfig.resolveProjectName()).toBe(
        defaultGraphQLProjectName,
      );
    });
  });

  describe('resolveSchemaPath()', () => {
    beforeEach(() => {
      existsSync.mockClear();
    });

    it('throws an error if the schemaPath is empty', () => {
      const projectConfig = new GraphQLProjectConfig({} as any, configPath);

      expect(() => projectConfig.resolveSchemaPath()).toThrowError(
        /Missing GraphQL schemaPath/i,
      );
    });

    it('throws an error if the schemaPath does not exist', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      existsSync.mockImplementation(() => false);

      expect(() => projectConfig.resolveSchemaPath()).toThrowError(
        /Schema not found/i,
      );
    });

    it('returns the schemaPath if it exists', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      existsSync.mockImplementation(() => true);

      expect(projectConfig.resolveSchemaPath()).toBe(
        join(__dirname, configData.schemaPath),
      );
      expect(existsSync).toHaveBeenCalledWith(
        join(__dirname, configData.schemaPath),
      );
    });

    it('returns the non-existent schemaPath when ignoreMissing is true', () => {
      const projectConfig = new GraphQLProjectConfig(configData, configPath);

      existsSync.mockImplementation(() => false);

      expect(projectConfig.resolveSchemaPath(true)).toBe(
        join(__dirname, configData.schemaPath),
      );
    });
  });
});
