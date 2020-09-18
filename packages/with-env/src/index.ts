interface EnvBackup {
  [key: string]: {isSet: boolean; value: string | undefined};
}

function getEnvValues(envVars: string[]): EnvBackup {
  return envVars.reduce((acc, key) => {
    acc[key] = {
      // only care for keys that already have an entry in `process.env`
      // as they would otherwise end up as `{KEY: "undefined"}` inside `process.env`
      isSet: key in process.env,
      value: process.env[key],
    };
    return acc;
  }, {} as EnvBackup);
}

function resetEnv(oldEnv: EnvBackup) {
  // delete all env keys that have been set by the test's `withEnv` call
  // to ensure `process.env` does not unecessarilty end up with `{KEY: "undefined"}` entries
  Object.entries(oldEnv).forEach(([key, {isSet, value}]) => {
    if (isSet) {
      process.env[key] = value;
    } else {
      delete process.env[key];
    }
  });
}

export default function withEnv<T = any>(
  env: string | NodeJS.ProcessEnv,
  callback: () => T,
): T {
  const envToSet = typeof env === 'string' ? {NODE_ENV: env} : env;
  const previousEnv = getEnvValues(Object.keys(envToSet));

  Object.entries(envToSet).forEach(([key, value]) => {
    process.env[key] = value;
  });

  try {
    const result = callback();
    if (result && (result as any).then) {
      return (result as any)
        .then((result: any) => {
          resetEnv(previousEnv);
          return result;
        })
        .catch((error: any) => {
          resetEnv(previousEnv);
          throw error;
        });
    } else {
      resetEnv(previousEnv);
      return result;
    }
  } catch (error) {
    resetEnv(previousEnv);
    throw error;
  }
}
