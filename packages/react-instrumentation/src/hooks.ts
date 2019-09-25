import {useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';
import {GraphQLOperationDetails} from '@shopify/react-graphql';

import {InstrumentContext} from './context';
import {InstrumentManager, Log} from './manager';

export function useInstrumentationManager() {
  return useContext(InstrumentContext);
}

export function useInstrumentEffect(
  perform: (instrument: InstrumentManager) => void,
) {
  const instrument = useContext(InstrumentContext);

  useServerEffect(() => {
    if (instrument != null) {
      return perform(instrument);
    }
  }, instrument ? instrument.effect : undefined);
}

export function useGraphQLOperation(operation: GraphQLOperationDetails) {
  useInstrumentEffect(instrument => instrument.addGraphQLOperation(operation));
}

export function useCustomLogField(logField: Log) {
  useInstrumentEffect(instrument => instrument.addLog(logField));
}
