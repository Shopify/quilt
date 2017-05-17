import {readFileSync, readJSONSync} from 'fs-extra';
import {
  Source,
  parse,
  concatAST,
  buildClientSchema,
} from 'graphql';
import {compile} from 'graphql-tool-utilities/ast';

export interface Options {
  schemaFile: string,
  graphQLFiles: string[],
}

export default function buildContext({
  schemaFile,
  graphQLFiles,
}: Options) {
  const schemaJSON = readJSONSync(schemaFile);
  const schema = buildClientSchema(schemaJSON.data);

  const sources = graphQLFiles.map((file) => {
    const body = readFileSync(file, 'utf8');
    return new Source(body, file);
  });
  const documents = concatAST(sources.map((source) => parse(source)));
  return compile(schema, documents);
}
