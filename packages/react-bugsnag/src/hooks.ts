import {useContext} from 'react';

import {ErrorLoggerContext} from './context';

export function useErrorLogger() {
  return useContext(ErrorLoggerContext);
}
