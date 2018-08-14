declare namespace Intl {
  class PluralRules {
    constructor(locale: string | string[]);

    select(count: number): string;
  }
}
