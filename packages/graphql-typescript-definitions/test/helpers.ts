import * as glob from 'glob';
import {readFileSync} from 'fs-extra';
import {resolve, dirname} from 'path';
import {Source, concatAST, parse, buildSchema} from 'graphql';
import {compile, AST, Operation, Fragment} from 'graphql-tool-utilities/ast';

import Generator from '../src/generator';
import {printFile} from '../src/print';

const schemaPath = resolve(__dirname, 'fixtures', 'schema.graphql');
const schema = buildSchema(readFileSync(schemaPath, 'utf8'));

export function getDefinitionsForFixture(fixture: string) {
  const fullFixture = resolve(__dirname, 'fixtures', fixture);
  const fixtureDir = dirname(fullFixture);
  const fixtureGraphQLFiles = glob.sync(resolve(fixtureDir, '*.graphql'));

  const sources = fixtureGraphQLFiles.map((file) => {
    const body = readFileSync(file, 'utf8');
    return new Source(body, file);
  });

  const documents = concatAST(sources.map((source) => parse(source)));
  const ast = compile(schema, documents);
  const generator = new Generator();

  return printFile(generator, getFile(fullFixture, ast), ast);
}

function getFile(path: string, ast: AST) {
  const file: {path: string, operation?: Operation, fragment?: Fragment} = {path};

  for (const name of Object.keys(ast.operations)) {
    const operation = ast.operations[name];
    if (operation.filePath === path) {
      file.operation = operation;
      break;
    }
  }

  for (const name of Object.keys(ast.fragments)) {
    const fragment = ast.fragments[name];
    if (fragment.filePath === path) {
      file.fragment = fragment;
      break;
    }
  }

  return file;
}

export function createMatcher(str: string) {
  return new RegExp(escapeRegExpSource(correctIndentation(str)));
}

function correctIndentation(str: string) {
  let size = -1;

  return str.replace(/\n(\s+)/g, (_, spaces) => {
    if (size < 0) {
      size = spaces.length;
    }

    return `\n${spaces.slice(Math.min(spaces.length, size))}`;
  }).trim();
}

function escapeRegExpSource(source: string) {
  return source.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
