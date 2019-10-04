export function expose(api: any) {
  self.addEventListener('message', async ({data}) => {
    try {
      const result = await api[data.invoke](...data.args);
      (self as any).postMessage({result});
    } catch (error) {
      const {name, message, stack} = error;
      (self as any).postMessage({
        error: {name, message, stack},
      });
    }
  });
}
