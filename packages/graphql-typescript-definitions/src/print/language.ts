import CodeGenerator from './generator';

export type Block = () => void;

export interface Interface {
  name: string,
  extend?: string[],
}

export interface Import {
  specifiers: string[],
  source: string,
}

export function printPropertyKey(
  name: string,
  nullable: boolean,
  generator: CodeGenerator,
) {
  generator.printOnNewline(name);
  generator.print(nullable && '?');
  generator.print(': ');
}

export function printExport(exported: Block, generator: CodeGenerator) {
  generator.printOnNewline('export ');
  exported();
}

export function printImport({specifiers, source}: Import, generator: CodeGenerator) {
  generator.printOnNewline(`import {${specifiers.join(', ')}} from '${source}';`);
}

export function printInterface(
  {name, extend = []}: Interface,
  body: Block,
  generator: CodeGenerator,
) {
  generator.print(`interface ${name} `);

  if (extend.length) {
    generator.print(`extends ${extend.join(', ')} `);
  }

  generator.withinBlock(body);
}

export function printNamespace(name: string, body: Block, generator: CodeGenerator) {
  generator.print(`namespace ${name} `);
  generator.withinBlock(body);
}
