import CodeGenerator from './generator';
import {printPropertyKey} from './language';

export class SpecialType {
  constructor(
    public typeName: string,
    public print: (generator: CodeGenerator) => void,
  ) {}
}

export const NullableFragment = new SpecialType(
  'NullableFragment',
  (generator) => {
    generator.printOnNewline('type NullableFragment<T> = ');
    generator.withinBlock(() => {
      printPropertyKey('[P in keyof T]', true, generator);
      generator.print('T[P] | null');
    });
  },
);
