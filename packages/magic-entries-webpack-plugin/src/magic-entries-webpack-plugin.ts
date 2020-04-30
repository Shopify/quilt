import {resolve, basename} from 'path';
import {promisify} from 'util';

import cbGlob from 'glob';
import {Compiler, Entry} from 'webpack';

const glob = promisify(cbGlob);

export interface Options {
  pattern: string;
  folder: string | string[];
  nameFromFile: (file: string) => string;
}

type EntryOption = Compiler['options']['entry'];

/**
 * A webpack plugin that automatically configures webpack entries by checking the filesystem
 * @param config
 * @returns a customized webpack plugin
 */
export class MagicEntriesPlugin {
  static server({folder = '.'}: Partial<Pick<Options, 'folder'>> = {}) {
    return new MagicEntriesPlugin({
      folder,
      pattern: '*.entry.server.{jsx,js,ts,tsx}',
      nameFromFile(file: string) {
        return defaultNameFromFile(file).replace('.server', '');
      },
    });
  }

  static client({folder = '.'}: Partial<Pick<Options, 'folder'>> = {}) {
    return new MagicEntriesPlugin({
      folder,
      pattern: '*.entry.client.{jsx,js,ts,tsx}',
      nameFromFile(file: string) {
        return defaultNameFromFile(file).replace('.client', '');
      },
    });
  }

  private options: Options;

  constructor({
    pattern = '*.entry.{jsx,js,ts,tsx}',
    folder = '.',
    nameFromFile = defaultNameFromFile,
  }: Partial<Options> = {}) {
    this.options = {
      folder,
      pattern,
      nameFromFile,
    };
  }

  apply(compiler: Compiler) {
    const originalEntries = compiler.options.entry;

    compiler.options.entry = async () => {
      const defaultEntries = await normalizedEntries(originalEntries);

      const entries = {
        ...(await defaultEntries),
        ...(await this.autodetectEntries(compiler.context)),
      };

      return entries;
    };
  }

  async autodetectEntries(context: string) {
    const {pattern, folder, nameFromFile} = this.options;
    const folders = typeof folder === 'string' ? [folder] : folder;
    const entries: Entry = {};

    for (const folder of folders) {
      const entryPattern = resolve(context, folder, pattern);
      const entryFiles = await glob(entryPattern);

      for (const entry of entryFiles) {
        entries[nameFromFile(entry)] = entry;
      }

      return entries;
    }
  }
}

function defaultNameFromFile(filename: string) {
  return basename(filename)
    .replace(/\.[tj]sx?/, '')
    .replace('.entry', '');
}

async function normalizedEntries(entry: EntryOption): Promise<Entry> {
  const rawEntry = typeof entry === 'function' ? await entry() : entry;

  if (rawEntry == null) {
    return {};
  }

  if (typeof rawEntry === 'string') {
    return {
      main: [rawEntry],
    };
  }

  if (Array.isArray(rawEntry)) {
    return {
      main: rawEntry,
    };
  }

  return rawEntry;
}
