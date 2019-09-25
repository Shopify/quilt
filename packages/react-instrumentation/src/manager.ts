import {EffectKind} from '@shopify/react-effect';
import {GraphQLOperationDetails} from '@shopify/react-graphql';

export {InstrumentContext} from './context';

export const EFFECT_ID = Symbol('instrument');

export interface Log {
  [key: string]: string | [] | number;
}

export class InstrumentManager {
  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => {
      this.reset();
    },
  };

  private graphQLOperations: GraphQLOperationDetails[] = [];
  private logs = new Set<Log>();

  reset() {
    this.graphQLOperations = [];
    this.logs = new Set<Log>();
  }

  addGraphQLOperation(operation: GraphQLOperationDetails) {
    this.graphQLOperations.push(operation);
  }

  addLog(log: Log) {
    this.logs.add(log);
  }

  getLogs() {
    return this.logs;
  }

  getGraphQLOperations() {
    return this.graphQLOperations;
  }
}
