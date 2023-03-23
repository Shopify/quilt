import type {Config} from '@bugsnag/js';
import bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

export type {Client} from '@bugsnag/js';
export type {Config};

export function createBugsnagClient(options: Config) {
  // We could alternatively use `start` here, the only difference between them is that `start` also sets a property on the Bugsnag global
  return bugsnag.createClient({
    // eslint-disable-next-line no-process-env
    releaseStage: process.env.NODE_ENV,
    autoTrackSessions: false,
    // Still report inline script errors, but don't capture augmented stack traces (very expensive):
    // See https://docs.google.com/document/d/1btW6nWLW92R5fRDtMb6PRXe19Sj1aBkJiBh_HYtPKxw/edit
    trackInlineScripts: false,
    enabledReleaseStages: ['production', 'staging'],
    plugins: [new BugsnagPluginReact()],
    maxBreadcrumbs: 40,
    ...options,
  });
}
