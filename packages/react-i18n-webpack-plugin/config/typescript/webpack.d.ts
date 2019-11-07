import webpack, {Module} from 'webpack';
import BasicEvaluatedExpression from 'webpack/lib/BasicEvaluatedExpression';
import {Tapable, HookMap, SyncBailHook} from 'tapable';
import {Expression, Statement, Literal} from 'estree';

declare module 'webpack' {
  export type ImportSource = Literal | string | null | undefined;

  interface ParserHooks {
    evaluate: HookMap<
      SyncBailHook<[Expression], BasicEvaluatedExpression | undefined | null>
    >;
    importSpecifier: SyncBailHook<
      [Statement, ImportSource, string, string],
      boolean | void
    >;
  }

  export class Parser extends Tapable {
    hooks: ParserHooks;
    state: {
      module: {
        resource;
      };
      [key: string]: any;
    };
  }
}
