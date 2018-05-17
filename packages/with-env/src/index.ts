export default function withEnv<T = any>(env: string, callback: () => T): T {
  // eslint-disable-next-line no-process-env
  const previousEnv = process.env.NODE_ENV;
  function resetEnv() {
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV = previousEnv;
  }
  // eslint-disable-next-line no-process-env
  process.env.NODE_ENV = env;

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
