import React from 'react';

import {ErrorLogger} from './types';

export const noopErrorLogger: ErrorLogger = {
  notify() {},
  leaveBreadcrumb() {},
};

export const ErrorLoggerContext = React.createContext<ErrorLogger>(
  noopErrorLogger,
);
