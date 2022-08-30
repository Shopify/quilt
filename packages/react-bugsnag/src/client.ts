import bugsnag, {Config} from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

export type {Client} from '@bugsnag/js';
export type {Config};

export function createBugsnagClient(options: Config) {
  // We could alternatively use `start` here, the only difference between them is that `start` also sets a property on the Bugsnag global
  return bugsnag.createClient({
    // eslint-disable-next-line no-process-env
    releaseStage: process.env.NODE_ENV,
    autoTrackSessions: false,
    enabledReleaseStages: ['production', 'staging'],
    plugins: [new BugsnagPluginReact()],
    maxBreadcrumbs: 40,
    ...options,
  });
}
