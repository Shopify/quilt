import {Client} from '@bugsnag/js';
import React from 'react';

import {ErrorLogger} from './types';

// eslint-disable-next-line no-console
const defaultNotify: Client['notify'] = (error) => console.error(error);

const defaultLeaveBreadcrumb: Client['leaveBreadcrumb'] = (message, metadata) =>
  // eslint-disable-next-line no-console
  console.info(message, metadata);

export const developmentClient: ErrorLogger = {
  notify: defaultNotify,
  leaveBreadcrumb: defaultLeaveBreadcrumb,
};

export const ErrorLoggerContext =
  React.createContext<ErrorLogger>(developmentClient);
