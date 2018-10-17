import {GraphQLConfigData, GraphQLProjectConfig} from 'graphql-config';
import {join} from 'path';
import '../src/index';

describe('graphql-tool-utilities', () => {
  const configData: GraphQLConfigData = {schemaPath: 'test'};
  const configPath = join(__dirname, '.graphqlconfig');

  it('augments GraphQLProjectConfig when importing the module API surface', () => {
    const projectConfig = new GraphQLProjectConfig(configData, configPath);

    expect(projectConfig.resolvePathRelativeToConfig).toBeInstanceOf(Function);
    expect(projectConfig.resolveProjectName).toBeInstanceOf(Function);
    expect(projectConfig.resolveSchemaPath).toBeInstanceOf(Function);
  });
});
