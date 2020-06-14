import ReactPlugin from '@bugsnag/plugin-react';

import {createBugsnagClient} from '../client';

jest.mock('@bugsnag/js', () => ({
  createClient: jest.fn(),
}));

const Bugsnag = require.requireMock('@bugsnag/js');

describe('createBugsnagClient()', () => {
  beforeEach(() => {
    Bugsnag.createClient.mockClear();
  });

  it('calls the underlying createClient function with sane defaults and the given API key', () => {
    createBugsnagClient({apiKey: 'floopus'});

    expect(Bugsnag.createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'floopus',
        // eslint-disable-next-line no-process-env
        releaseStage: process.env.NODE_ENV,
        autoTrackSessions: false,
        enabledReleaseStages: ['production', 'staging'],
        plugins: [{lazy: true, name: 'react'}],
        maxBreadcrumbs: 40,
      }),
    );
  });

  it('allows overrides of other config values', () => {
    createBugsnagClient({
      apiKey: 'floopus',
      releaseStage: '😉',
      enabledReleaseStages: ['😉'],
    });

    expect(Bugsnag.createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'floopus',
        releaseStage: '😉',
        autoTrackSessions: false,
        enabledReleaseStages: ['😉'],
        plugins: expect.any(Array),
        maxBreadcrumbs: 40,
      }),
    );
  });
});
