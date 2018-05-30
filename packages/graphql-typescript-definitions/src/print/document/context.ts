import * as t from '@babel/types';
import {relative, dirname} from 'path';
import {ucFirst} from 'change-case';
import {
  Operation,
  Fragment,
  AST,
  isOperation,
} from 'graphql-tool-utilities/ast';

export interface Options {
  schemaTypesPath: string;
  addTypename?: boolean;
}

export interface OperationOptions extends Options {
  partial?: boolean;
}

export type NamespaceExportableType = t.TSInterfaceDeclaration;

export class FileContext {
  get schemaImports() {
    const {
      path,
      importedTypes,
      options: {schemaTypesPath},
    } = this;

    return importedTypes.size > 0
      ? t.importDeclaration(
          [...importedTypes].map((type) =>
            t.importSpecifier(t.identifier(type), t.identifier(type)),
          ),
          t.stringLiteral(importPath(path, schemaTypesPath)),
        )
      : null;
  }

  private importedTypes = new Set<string>();

  constructor(private path: string, private options: Options) {}

  import(type: string) {
    this.importedTypes.add(type);
  }
}

export class OperationContext {
  get typeName() {
    let typeName: string;

    if (isOperation(this.operation)) {
      const {operationName, operationType} = this.operation;
      typeName = `${ucFirst(operationName)}${ucFirst(operationType)}Data`;
    } else {
      const {fragmentName} = this.operation;
      typeName = `${ucFirst(fragmentName)}FragmentData`;
    }

    return this.options.partial
      ? typeName.replace(/Data$/, 'PartialData')
      : typeName;
  }

  get namespace() {
    const {exported, typeName} = this;

    return exported.length > 0
      ? t.tsModuleDeclaration(
          t.identifier(typeName),
          t.tsModuleBlock(
            exported.map((type) => t.exportNamedDeclaration(type, [])),
          ),
        )
      : null;
  }

  get exported() {
    return this.exportedTypes;
  }

  private exportedTypes: NamespaceExportableType[] = [];

  constructor(
    public operation: Operation | Fragment,
    public ast: AST,
    public options: OperationOptions,
    public file: FileContext,
  ) {}

  export(type: NamespaceExportableType) {
    this.exportedTypes.push(type);

    return t.tsTypeReference(
      t.tsQualifiedName(
        t.identifier(this.typeName),
        t.identifier(type.id.name),
      ),
    );
  }
}

function importPath(from: string, to: string) {
  const relativePath = relative(dirname(from), to);
  const normalizedPath = relativePath.startsWith('..')
    ? relativePath
    : `./${relativePath}`;
  return normalizedPath.replace(/\.ts$/, '');
}
