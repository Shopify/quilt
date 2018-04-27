export default function withEnv<T = any>(env: string, callback: () => T): T {
  const previousEnv = process.env.NODE_ENV;
  function resetEnv() {
    process.env.NODE_ENV = previousEnv;
  }

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
