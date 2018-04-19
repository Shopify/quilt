export function withEnv<T = any>(env: string, callback: () => T): T {
  process.env.NODE_ENV = env;

  function resetEnv() {
    process.env.NODE_ENV = 'test';
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
