export function createWorkerMessenger(url: URL) {
  const workerScript = URL.createObjectURL(
    new Blob([`importScripts(${JSON.stringify(url.href)})`]),
  );

  const worker = new Worker(workerScript);

  const originalTerminate = worker.terminate.bind(worker);
  worker.terminate = () => {
    URL.revokeObjectURL(workerScript);
    originalTerminate();
  };

  return worker;
}
