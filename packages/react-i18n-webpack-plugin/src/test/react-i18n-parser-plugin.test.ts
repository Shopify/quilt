import VirtualModulesPlugin from 'webpack-virtual-modules';

import {ReactI18nParserPlugin, Options} from '../react-i18n-parser-plugin';

import {createParser} from './utilities';

jest.mock('webpack/lib/ParserHelpers', () => ({
  requireFileAsExpression: jest.fn(),
  addParsedVariableToModule: jest.fn(),
  toConstantDependency: jest.fn(() => jest.fn()),
}));

describe('ReactI18nParserPlugin', () => {
  const defaultOptions: Options = {
    fallbackLocale: 'en',
  };

  describe('importSpecifier', () => {
    it('called importSpecifier tap with plugin name', () => {
      const mockTap = jest.fn();
      const parser = createParser({
        importSpecifierTap: mockTap,
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(
        defaultOptions,
        new VirtualModulesPlugin(),
      );
      reactI18nParserPlugin.apply(parser);

      expect(mockTap).toHaveBeenCalledWith(
        'ReactI18nParserPlugin',
        expect.any(Function),
      );
    });

    it('adds to i18nImports if exportName is useI18n', () => {
      const componentPath = '/abc/path';
      const exportName = 'useI18n';
      const identifierName = 'useI18nAlias';

      const parser = createParser({
        componentPath,
        importSpecifierTap: jest.fn((_name, callback) => {
          callback({} as any, '', exportName, identifierName);
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(
        defaultOptions,
        new VirtualModulesPlugin(),
      );
      reactI18nParserPlugin.apply(parser);

      expect(parser.state.i18nImports).not.toBeUndefined();
      const importIdentifiers = parser.state.i18nImports.get(componentPath);

      expect(importIdentifiers).not.toBeUndefined();
      expect(importIdentifiers).toContain(identifierName);
    });

    it('adds to i18nImports if exportName is withI18n', () => {
      const componentPath = '/abc/path';
      const exportName = 'withI18n';
      const identifierName = 'withI18nAlias';

      const parser = createParser({
        componentPath,
        importSpecifierTap: jest.fn((_name, callback) => {
          callback({} as any, '', exportName, identifierName);
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(
        defaultOptions,
        new VirtualModulesPlugin(),
      );
      reactI18nParserPlugin.apply(parser);

      expect(parser.state.i18nImports).not.toBeUndefined();
      const importIdentifiers = parser.state.i18nImports.get(componentPath);

      expect(importIdentifiers).not.toBeUndefined();
      expect(importIdentifiers).toContain(identifierName);
    });

    it('adds to i18nImports twice when both type of export exist', () => {
      const componentPath = '/abc/path';
      const exportNameOne = 'useI18n';
      const identifierNameOne = 'useI18nAlias';
      const exportNameTwo = 'withI18n';
      const identifierNameTwo = 'withI18nAlias';

      const parser = createParser({
        componentPath,
        importSpecifierTap: jest.fn((_name, callback) => {
          callback({} as any, '', exportNameOne, identifierNameOne);
          callback({} as any, '', exportNameTwo, identifierNameTwo);
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(
        defaultOptions,
        new VirtualModulesPlugin(),
      );
      reactI18nParserPlugin.apply(parser);

      expect(parser.state.i18nImports).not.toBeUndefined();
      const importIdentifiers = parser.state.i18nImports.get(componentPath);

      expect(importIdentifiers).not.toBeUndefined();
      expect(importIdentifiers).toContain(identifierNameOne);
      expect(importIdentifiers).toContain(identifierNameTwo);
    });

    it('does not add to i18nImports if exportName is not useI18n or withI18n', () => {
      const componentPath = '/abc/path';
      const exportName = 'something';

      const parser = createParser({
        componentPath,
        importSpecifierTap: jest.fn((_name, callback) => {
          callback({} as any, '', exportName, 'alias');
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(
        defaultOptions,
        new VirtualModulesPlugin(),
      );
      reactI18nParserPlugin.apply(parser);

      expect(parser.state.i18nImports).toBeUndefined();
    });
  });

  describe('does not replace i18n call', () => {
    it('does not call writeModule if the path included node_modules', () => {
      const componentPath = '/abc/node_modules/path';
      const mockWriteModule = jest.fn();
      const mockTap = jest.fn();
      const parser = createParser({
        i18nImports: new Map([[componentPath, ['useI18n', 'useI18nAlias']]]),
        evaluateTap: mockTap,
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(defaultOptions, {
        writeModule: mockWriteModule,
      } as any);
      reactI18nParserPlugin.apply(parser);

      expect(mockWriteModule).not.toHaveBeenCalled();
    });

    it('does not call writeModule if parser.state.i18nImports does not exist', () => {
      const componentPath = '/abc/path';
      const mockWriteModule = jest.fn();
      const mockTap = jest.fn();
      const parser = createParser({
        i18nImports: new Map([[componentPath, ['useI18n', 'useI18nAlias']]]),
        evaluateTap: mockTap,
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(defaultOptions, {
        writeModule: mockWriteModule,
      } as any);
      reactI18nParserPlugin.apply(parser);

      expect(mockWriteModule).not.toHaveBeenCalled();
    });

    it('does not call writeModule if the current path cannot be found in parser.state.i18nImports', () => {
      const componentPath = '/abc/path1';
      const mockWriteModule = jest.fn();
      const mockTap = jest.fn();
      const parser = createParser({
        i18nImports: new Map([[componentPath, ['useI18n', 'useI18nAlias']]]),
        evaluateTap: mockTap,
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(defaultOptions, {
        writeModule: mockWriteModule,
      } as any);
      reactI18nParserPlugin.apply(parser);

      expect(mockWriteModule).not.toHaveBeenCalled();
    });

    it('does not call writeModule if the expression type if not Identifier', () => {
      const componentPath = 'abc/path';
      const componentDirectory = 'abc';
      const mockWriteModule = jest.fn();
      const identifierName = 'useI18nAlias';
      const parser = createParser({
        componentPath,
        componentDirectory,
        i18nImports: new Map([[componentPath, [identifierName]]]),
        evaluateTap: jest.fn((_name, callback) => {
          callback(
            {
              type: 'CallExpression',
              callee: {
                type: 'ThisExpression',
              },
              arguments: [],
            },
            {} as any,
            {} as any,
          );
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(defaultOptions, {
        writeModule: mockWriteModule,
      } as any);
      reactI18nParserPlugin.apply(parser);

      expect(mockWriteModule).not.toHaveBeenCalled();
    });
  });

  describe('replace i18n call', () => {
    it('calls writeModule successfully', () => {
      const componentPath = 'abc/path';
      const componentDirectory = 'abc';
      const mockWriteModule = jest.fn();
      const identifierName = 'useI18nAlias';
      const parser = createParser({
        componentPath,
        componentDirectory,
        i18nImports: new Map([[componentPath, [identifierName]]]),
        evaluateTap: jest.fn((_name, callback) => {
          callback(
            {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: identifierName,
              },
              arguments: [],
            },
            {} as any,
            {} as any,
          );
        }),
      });

      const reactI18nParserPlugin = new ReactI18nParserPlugin(defaultOptions, {
        writeModule: mockWriteModule,
      } as any);
      reactI18nParserPlugin.apply(parser);

      expect(mockWriteModule).toHaveBeenCalled();
    });
  });
});
