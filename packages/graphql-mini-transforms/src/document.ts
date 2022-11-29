import {createHash} from 'crypto';

import {
  print,
  parse,
  DocumentNode as UntypedDocumentNode,
  DefinitionNode,
  SelectionSetNode,
  ExecutableDefinitionNode,
  OperationDefinitionNode,
  SelectionNode,
  Location,
} from 'graphql';
import {DocumentNode, SimpleDocument} from 'graphql-typed';

const IMPORT_REGEX = /^#import\s+['"]([^'"]*)['"];?[\s\n]*/gm;
const DEFAULT_NAME = 'Operation';

export function cleanDocument(
  document: UntypedDocumentNode,
  {removeUnused = true} = {},
): DocumentNode<any, any, any> {
  if (removeUnused) {
    removeUnusedDefinitions(document);
  }

  for (const definition of document.definitions) {
    addTypename(definition);
  }

  const normalizedSource = minifySource(print(document));
  const normalizedDocument = parse(normalizedSource);

  for (const definition of normalizedDocument.definitions) {
    stripLoc(definition);
  }

  // This ID is a hash of the full file contents that are part of the document,
  // including other documents that are injected in, but excluding any unused
  // fragments. This is useful for things like persisted queries.
  const id = createHash('sha256').update(normalizedSource).digest('hex');

  Reflect.defineProperty(normalizedDocument, 'id', {
    value: id,
    enumerable: true,
    writable: false,
    configurable: false,
  });

  Reflect.defineProperty(normalizedDocument, 'loc', {
    value: stripDocumentLoc(normalizedDocument.loc),
    enumerable: true,
    writable: false,
    configurable: false,
  });

  return normalizedDocument as any;
}

export function extractImports(rawSource: string) {
  const imports = new Set<string>();

  const source = rawSource.replace(IMPORT_REGEX, (_, imported) => {
    imports.add(imported);
    return '';
  });

  return {imports: [...imports], source};
}

export function toSimpleDocument<
  Data extends {},
  Variables extends {},
  DeepPartial extends {},
>(
  document: DocumentNode<Data, Variables, DeepPartial>,
): SimpleDocument<Data, Variables, DeepPartial> {
  return {
    id: document.id,
    name: operationNameForDocument(document),
    source: document.loc?.source?.body!,
  };
}

function operationNameForDocument(document: DocumentNode) {
  return document.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      definition.kind === 'OperationDefinition',
  )?.name?.value;
}

function removeUnusedDefinitions(document: UntypedDocumentNode) {
  const usedDefinitions = new Set<DefinitionNode>();
  const dependencies = definitionDependencies(document.definitions);

  const markAsUsed = (definition: DefinitionNode) => {
    if (usedDefinitions.has(definition)) {
      return;
    }

    usedDefinitions.add(definition);

    for (const dependency of dependencies.get(definition) || []) {
      markAsUsed(dependency);
    }
  };

  for (const definition of document.definitions) {
    if (definition.kind !== 'FragmentDefinition') {
      markAsUsed(definition);
    }
  }

  (document as any).definitions = [...usedDefinitions];
}

function minifySource(source: string) {
  return source
    .replace(/#.*/g, '')
    .replace(/\\n/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replace(/\s*({|}|\(|\)|\.|:|,)\s*/g, '$1');
}

function definitionDependencies(definitions: ReadonlyArray<DefinitionNode>) {
  const executableDefinitions: ExecutableDefinitionNode[] = definitions.filter(
    (definition) =>
      definition.kind === 'OperationDefinition' ||
      definition.kind === 'FragmentDefinition',
  ) as any[];

  const definitionsByName = new Map(
    executableDefinitions.map<[string, DefinitionNode]>((definition) => [
      definition.name ? definition.name.value : DEFAULT_NAME,
      definition,
    ]),
  );

  return new Map(
    executableDefinitions.map<[DefinitionNode, DefinitionNode[]]>(
      (executableNode) => [
        executableNode,
        [...collectUsedFragmentSpreads(executableNode, new Set())].map(
          (usedFragment) => {
            const definition = definitionsByName.get(usedFragment);

            if (definition == null) {
              throw new Error(
                `You attempted to use the fragment '${usedFragment}' (in '${
                  executableNode.name ? executableNode.name.value : DEFAULT_NAME
                }'), but it does not exist. Maybe you forgot to import it from another document?`,
              );
            }

            return definition;
          },
        ),
      ],
    ),
  );
}

const TYPENAME_FIELD = {
  kind: 'Field',
  alias: null,
  name: {kind: 'Name', value: '__typename'},
};

function addTypename(definition: DefinitionNode) {
  for (const {selections} of selectionSetsForDefinition(definition)) {
    const hasTypename = selections.some(
      (selection) =>
        selection.kind === 'Field' && selection.name.value === '__typename',
    );

    if (!hasTypename) {
      (selections as any[]).push(TYPENAME_FIELD);
    }
  }
}

function collectUsedFragmentSpreads(
  definition: DefinitionNode,
  usedSpreads: Set<string>,
) {
  for (const selection of selectionsForDefinition(definition)) {
    if (selection.kind === 'FragmentSpread') {
      usedSpreads.add(selection.name.value);
    }
  }

  return usedSpreads;
}

function selectionsForDefinition(
  definition: DefinitionNode,
): IterableIterator<SelectionNode> {
  if (!('selectionSet' in definition) || definition.selectionSet == null) {
    return [][Symbol.iterator]();
  }

  return selectionsForSelectionSet(definition.selectionSet);
}

function* selectionSetsForDefinition(
  definition: DefinitionNode,
): IterableIterator<SelectionSetNode> {
  if (!('selectionSet' in definition) || definition.selectionSet == null) {
    return [][Symbol.iterator]();
  }

  if (definition.kind !== 'OperationDefinition') {
    yield definition.selectionSet;
  }

  for (const nestedSelection of selectionsForDefinition(definition)) {
    if (
      'selectionSet' in nestedSelection &&
      nestedSelection.selectionSet != null
    ) {
      yield nestedSelection.selectionSet;
    }
  }
}

function* selectionsForSelectionSet({
  selections,
}: SelectionSetNode): IterableIterator<SelectionNode> {
  for (const selection of selections) {
    yield selection;

    if ('selectionSet' in selection && selection.selectionSet != null) {
      yield* selectionsForSelectionSet(selection.selectionSet);
    }
  }
}

type Writable<T> = {-readonly [K in keyof T]: T[K]};

function stripDocumentLoc(loc?: Location) {
  const normalizedLoc: Partial<Writable<Location>> = {...loc};
  delete normalizedLoc.endToken;
  delete normalizedLoc.startToken;
  return normalizedLoc;
}

function stripLoc(value: unknown) {
  if (Array.isArray(value)) {
    value.forEach(stripLoc);
  } else if (typeof value === 'object') {
    if (value == null) {
      return;
    }

    if ('loc' in value) {
      delete (value as {loc: unknown}).loc;
    }

    for (const key of Object.keys(value)) {
      stripLoc((value as any)[key]);
    }
  }
}
