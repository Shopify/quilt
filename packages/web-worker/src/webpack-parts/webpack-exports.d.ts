declare module 'webpack/lib/SingleEntryPlugin' {
  const SingleEntryPlugin: {
    new (...args: any[]): import('webpack').Plugin;
  };

  export default SingleEntryPlugin;
}

declare module 'webpack/lib/webworker/WebWorkerTemplatePlugin' {
  const SingleEntryPlugin: {
    new (...args: any[]): import('webpack').Plugin;
  };

  export default SingleEntryPlugin;
}

declare module 'webpack/lib/web/FetchCompileWasmTemplatePlugin' {
  const SingleEntryPlugin: {
    new (...args: any[]): import('webpack').Plugin;
  };

  export default SingleEntryPlugin;
}
