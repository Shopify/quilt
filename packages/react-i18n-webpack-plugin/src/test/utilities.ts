import {Parser, ImportSource} from 'webpack';
import {Hook} from 'tapable';
import {Expression, Statement} from 'estree';

export function createParser({
  componentPath,
  componentDirectory,
  importSpecifierTap,
  evaluateTap,
  i18nImports,
  translationFiles,
}: {
  componentPath?: string;
  componentDirectory?: string;
  importSpecifierTap?: Hook<Statement, ImportSource, string, string>['tap'];
  evaluateTap?: Hook<Expression>['tap'];
  i18nImports?: Map<string, string[]>;
  translationFiles?: string[];
}): Parser {
  const mockParser = {
    state: {
      module: {
        resource: componentPath ? componentPath : 'abc/path',
        context: componentDirectory ? componentDirectory : 'abc',
      },
      i18nImports: i18nImports ? i18nImports : undefined,
      compilation: {
        compiler: {
          inputFileSystem: {
            readdirSync: jest.fn(() =>
              translationFiles ? translationFiles : ['en.json'],
            ),
          },
        },
      },
    },
    hooks: {
      importSpecifier: {
        get: jest.fn(),
        for: jest.fn(),
        taps: [],
        interceptors: [],
        call: jest.fn(),
        promise: jest.fn(),
        callAsync: jest.fn(),
        compile: jest.fn(),
        tap: importSpecifierTap ? importSpecifierTap : jest.fn(),
        tapAsync: jest.fn(),
        tapPromise: jest.fn(),
        intercept: jest.fn(),
      },
      evaluate: {
        get: jest.fn(),
        for: jest.fn(),
        taps: [],
        interceptors: [],
        call: jest.fn(),
        promise: jest.fn(),
        callAsync: jest.fn(),
        compile: jest.fn(),
        tap: evaluateTap ? evaluateTap : jest.fn(),
        tapAsync: jest.fn(),
        tapPromise: jest.fn(),
        intercept: jest.fn(),
      },
    },
  };

  jest.spyOn(mockParser.hooks.evaluate, 'for').mockImplementation(() => {
    return mockParser.hooks.evaluate;
  });

  return (mockParser as unknown) as Parser;
}
