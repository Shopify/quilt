import {Env} from './types';

export default function withEnv<T = any>(env: Env, callback: () => T): T {
  const envToSet = typeof env === 'string' ? {NODE_ENV: env} : env;

  const previousEnv = Object.keys(envToSet).reduce((previousEnv, key) => {
    // only care for keys that already have an entry in `process.env`
    // as they would otherwise end up as `{KEY: "undefined"}` inside `process.env`
    if (typeof process.env[key] !== 'undefined') {
      previousEnv[key] = process.env[key];
    }
    return previousEnv;
  }, {});

  Object.assign(process.env, envToSet);

  function resetEnv() {
    // delete all env keys that have been set by the test's `withEnv` call
    // to ensure `process.env` does not unecessarilty end up with `{KEY: "undefined"}` entries
    Object.keys(envToSet).forEach(key => {
      delete process.env[key];
    });

    Object.assign(process.env, previousEnv);
  }

  try {
    const result = callback();
    if (result && (result as any).then) {
      return (result as any)
        .then((result: any) => {
          resetEnv();
          return result;
        })
        .catch((error: any) => {
          resetEnv();
          throw error;
        });
    } else {
      resetEnv();
      return result;
    }
  } catch (error) {
    resetEnv();
    throw error;
  }
}
