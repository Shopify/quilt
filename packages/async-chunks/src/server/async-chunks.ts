import {readJSON} from 'fs-extra';
import {resolve} from 'path';

export interface Asset {
  path: string;
  integrity?: string;
}

export interface ChunkDependency {
  file: string;
  publicPath: string;
  chunkName: string;
  id?: string;
  name?: string;
}

export interface Manifest {
  [bundle: string]: ChunkDependency[];
}

export interface Chunks {
  scripts: Set<Asset>;
  styles: Set<Asset>;
}

const root = resolve(__dirname, '../../../../');
export const defaultManifest = resolve(
  root,
  'build',
  'client',
  'react-loadable.json',
);

let asyncAssetsManifest: Promise<Manifest> | null = null;

function loadAsyncAssetsManifest(manifest: string) {
  if (asyncAssetsManifest) {
    return asyncAssetsManifest;
  }

  try {
    asyncAssetsManifest = readJSON(manifest);
    return asyncAssetsManifest;
  } catch (error) {
    throw error;
  }
}

export function clearCache() {
  asyncAssetsManifest = null;
}

export default class AsyncChunks {
  constructor(private manifestPath: string = defaultManifest) {}

  async chunks(moduleIds: string[]): Promise<Chunks> {
    const manifest = await this.getAsyncChunksManifest();
    const assets: Asset[] = this.matchAssets(manifest, moduleIds);

    const scripts = new Set(
      assets.filter(bundle => bundle.path.endsWith('.js')),
    );
    const styles = new Set(
      assets.filter(bundle => bundle.path.endsWith('.css')),
    );

    return {scripts, styles};
  }

  async getAsyncChunksManifest() {
    try {
      const manifest = await loadAsyncAssetsManifest(this.manifestPath);
      return manifest;
    } catch (error) {
      throw new Error(`Manifest not found: ${this.manifestPath}`);
    }
  }

  private matchAssets(manifest: Manifest | null, moduleIds: string[]): Asset[] {
    const chunks: ChunkDependency[] = [];

    if (manifest === null) {
      return [];
    }

    const nonExistentModules = moduleIds.find(module => !manifest[module]);
    if (nonExistentModules) {
      return [];
    }

    return moduleIds
      .reduce((chunks, moduleId) => {
        return chunks.concat(manifest[moduleId]);
      }, chunks)
      .map((chunk: any) => {
        return {path: chunk.publicPath};
      });
  }
}
