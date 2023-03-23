declare module 'webpack/lib/SingleEntryPlugin' {
  import type {Plugin} from 'webpack';

  const SingleEntryPlugin: {
    new (...args: any[]): Plugin;
  };

  export default SingleEntryPlugin;
}

declare module 'webpack/lib/webworker/WebWorkerTemplatePlugin' {
  import type {Plugin} from 'webpack';

  const SingleEntryPlugin: {
    new (...args: any[]): Plugin;
  };

  export default SingleEntryPlugin;
}

declare module 'webpack/lib/web/FetchCompileWasmTemplatePlugin' {
  import type {Plugin} from 'webpack';

  const SingleEntryPlugin: {
    new (...args: any[]): Plugin;
  };

  export default SingleEntryPlugin;
}
