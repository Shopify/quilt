import VirtualModulesPlugin from 'webpack-virtual-modules';

import {PLUGIN} from '../common';

type Plugin = import('webpack').Plugin;

interface Options {
  globalObject?: string;
  plugins?: ReadonlyArray<Plugin>;
  filename?: string;
}

export class WebWorkerPlugin implements Plugin {
  static isInstance(value: unknown): value is WebWorkerPlugin {
    return Boolean((value as WebWorkerPlugin)?.[PLUGIN]);
  }

  public readonly virtualModules = new VirtualModulesPlugin({});
  public workerId = 0;
  private readonly [PLUGIN] = true;

  constructor(public readonly options: Options = {}) {}

  apply(compiler: import('webpack').Compiler) {
    this.virtualModules.apply(compiler);
  }
}
