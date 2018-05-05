import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLType,
  GraphQLScalarType,
} from 'graphql';
import {AST} from 'graphql-tool-utilities/ast';

import Document from './document';
import {builtInScalarMap} from './graphql';
import {SpecialType} from './special-types';

export interface Options {
  addTypename: boolean,
}

export default class Context {
  document!: Document;
  typesUsed = new Set<GraphQLInputType>();
  specialTypesUsed = new Set<SpecialType>();
  importsUsed = new Map<string, Set<string>>();

  constructor(public ast: AST, public options: Options) {}

  addUsedExternalFragments(fragments: string[]) {
    for (const fragmentName of fragments) {
      const fragment = this.ast.fragments[fragmentName];
      this.addUsedImport(`${fragmentName}Fragment`, fragment.filePath);
    }
  }

  addUsedImport(name: string, source: string) {
    const imports = this.importsUsed.get(source) || new Set();
    imports.add(name);
    this.importsUsed.set(source, imports);
  }

  addUsedSpecialType(type: SpecialType) {
    this.specialTypesUsed.add(type);
  }

  addUsedType(type: GraphQLType) {
    const {typesUsed} = this;

    if (typesUsed.has(type as GraphQLInputType)) { return; }

    if (type instanceof GraphQLEnumType) {
      typesUsed.add(type);
    } else if (type instanceof GraphQLInputObjectType) {
      typesUsed.add(type);

      const fields = type.getFields();
      Object
        .keys(fields)
        .map((fieldName) => fields[fieldName])
        .forEach((typeField) => this.addUsedType(typeField.type));
    } else if (type instanceof GraphQLScalarType && !builtInScalarMap.hasOwnProperty(type.name)) {
      typesUsed.add(type);
    } else if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
      this.addUsedType(type.ofType);
    }
  }
}
