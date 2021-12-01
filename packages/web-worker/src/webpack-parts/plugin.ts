import VirtualModulesPlugin from 'webpack-virtual-modules';
import type {WebpackPluginInstance, Compiler} from 'webpack';

import {PLUGIN} from '../common';

interface Options {
  globalObject?: string;
  plugins?: ReadonlyArray<WebpackPluginInstance>;
  filename?: string;
}

export class WebWorkerPlugin implements WebpackPluginInstance {
  static isInstance(value: unknown): value is WebWorkerPlugin {
    return Boolean((value as WebWorkerPlugin)?.[PLUGIN]);
  }

  public readonly virtualModules = new VirtualModulesPlugin();
  public workerId = 0;
  private readonly [PLUGIN] = true;

  constructor(public readonly options: Options = {}) {}

  apply(compiler: Compiler) {
    this.virtualModules.apply(compiler);
  }
}
