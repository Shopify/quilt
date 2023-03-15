import React from 'react';

import type {ErrorLogger} from './types';

export const noopErrorLogger: ErrorLogger = {
  notify() {},
  leaveBreadcrumb() {},
};

export const ErrorLoggerContext =
  React.createContext<ErrorLogger>(noopErrorLogger);
