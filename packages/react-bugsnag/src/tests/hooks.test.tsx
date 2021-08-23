import React from 'react';
import {mount} from '@shopify/react-testing';

import {ErrorLoggerContext} from '../context';
import {useErrorLogger} from '../hooks';

describe('useErrorLogger()', () => {
  it('returns the logger from context', () => {
    const fakeLogger = {
      notify: jest.fn(),
      leaveBreadcrumb: jest.fn(),
    };

    function DummyComponent({logContent}: {logContent: string}) {
      const logger = useErrorLogger();
      logger.notify(logContent);
      logger.leaveBreadcrumb(logContent);
      return <>nothing</>;
    }

    mount(
      <ErrorLoggerContext.Provider value={fakeLogger}>
        <DummyComponent logContent="test string" />
      </ErrorLoggerContext.Provider>,
    );

    expect(fakeLogger.notify).toHaveBeenCalledWith('test string');
    expect(fakeLogger.leaveBreadcrumb).toHaveBeenCalledWith('test string');
  });
});
