import {basename, resolve} from 'path';

import globToRegExp from 'glob-to-regexp';
import {Compiler, Entry} from 'webpack';

type EntryOption = Compiler['options']['entry'];

export interface Options {
  pattern: string;
  folder: string | string[];
  nameFromFile: (file: string) => string;
  onCompilerEntries: ((entry: EntryOption) => Entry) | null;
}

/**
 * A webpack plugin that automatically configures webpack entries by checking the filesystem
 * @param config
 * @returns a customized webpack plugin
 */
export class MagicEntriesPlugin {
  static server({
    folder = '.',
    onCompilerEntries = null,
  }: Partial<Pick<Options, 'folder' | 'onCompilerEntries'>> = {}) {
    return new MagicEntriesPlugin({
      folder,
      pattern: '*.entry.server.{jsx,js,ts,tsx}',
      nameFromFile(file: string) {
        return defaultNameFromFile(file).replace('.server', '');
      },
      onCompilerEntries,
    });
  }

  static client({
    folder = '.',
    onCompilerEntries = null,
  }: Partial<Pick<Options, 'folder' | 'onCompilerEntries'>> = {}) {
    return new MagicEntriesPlugin({
      folder,
      pattern: '*.entry.client.{jsx,js,ts,tsx}',
      nameFromFile(file: string) {
        return defaultNameFromFile(file).replace('.client', '');
      },
      onCompilerEntries,
    });
  }

  private options: Options;
  private compiledPattern: RegExp;

  constructor({
    pattern = '*.entry.{jsx,js,ts,tsx}',
    folder = '.',
    nameFromFile = defaultNameFromFile,
    onCompilerEntries = null,
  }: Partial<Options> = {}) {
    this.options = {
      folder,
      pattern,
      nameFromFile,
      onCompilerEntries,
    };
    this.compiledPattern = globToRegExp(pattern, {extended: true});
  }

  apply(compiler: Compiler) {
    const originalEntries = compiler.options.entry;

    compiler.options.entry = async () => {
      const defaultEntries = await normalizedEntries(originalEntries);

      const entries = {
        ...(await defaultEntries),
        ...(await this.autodetectEntries(compiler)),
      };

      if (typeof this.options.onCompilerEntries === 'function') {
        return this.options.onCompilerEntries(entries);
      }

      return entries;
    };
  }

  async autodetectEntries(compiler: Compiler) {
    const {folder, nameFromFile} = this.options;
    const folders = typeof folder === 'string' ? [folder] : folder;
    const entries: Entry = {};

    for (const folder of folders) {
      const resolvedFolder = resolve(compiler.context, folder);
      const files: string[] = await new Promise((resolve, reject) => {
        (compiler.inputFileSystem as any).readdir(
          resolvedFolder,
          (error, data) => {
            if (error) {
              return reject(error);
            }
            resolve(data);
          },
        );
      });

      const entryFiles = await files
        .filter((file) => this.compiledPattern.exec(file))
        .map((file) => resolve(resolvedFolder, file));

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
