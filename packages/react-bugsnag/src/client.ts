import bugsnag, {Config} from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

export function createBugsnagClient(options: Config) {
  const defaultPlugins =
    typeof window === 'undefined' ? [] : [new BugsnagPluginReact()];

  // We could alternatively use `start` here, the only difference between them is that `start` also sets a property on the Bugsnag global
  return bugsnag.createClient({
    // eslint-disable-next-line no-process-env
    releaseStage: process.env.NODE_ENV,
    autoTrackSessions: false,
    enabledReleaseStages: ['production', 'staging'],
    plugins: defaultPlugins,
    maxBreadcrumbs: 40,
    ...options,
  });
}
