import {join} from 'path';

import {readFile, readJson, pathExists} from 'fs-extra';
import {matchesUA} from 'browserslist-useragent';
import appRoot from 'app-root-path';
import {ungzip} from 'node-gzip';

import type {ConsolidatedManifest, Manifest} from './types';

const DEFAULT_MANIFEST_PATH = 'build/client/assets.json';

export interface ResolveOptions {
  locale?: string | undefined;
}

export class Manifests {
  path: string;
  private caching: boolean;
  private resolvedEntry?: Manifest;

  constructor(path: string | null = null, caching = true) {
    this.path = path || DEFAULT_MANIFEST_PATH;
    this.caching = caching;
  }

  async resolve(userAgent, {locale}: ResolveOptions = {}): Promise<Manifest> {
    const {
      fallbackManifest,
      multiAsyncLanguageManifests,
      inlineLocaleManifests,
    } = await loadConsolidatedManifest(this.path, this.caching);

    // We do the following to determine the correct manifest to use:
    //
    // For manifests with a matching `locale`:
    // 1. If there is no user agent, use the "last" manifest, which is the
    // least restrictive set of browsers.
    // 2. If there is only one manifest, use it, regardless of how well it
    // matches the user agent.
    // 3. If there is a user agent, find the first manifest where the
    // browsers it was compiled for matches the user agent, or where there
    // is no browser restriction on the bundle.
    // 4. If no matching manifests are found, fall back to the last manifest.
    //
    // If a locale-specific match is not found, then the above process is
    // repeated for manifests with multi-language support (i.e., no locale
    // attribute).

    this.resolvedEntry =
      findManifestForLocale(inlineLocaleManifests, locale, userAgent) ||
      find(multiAsyncLanguageManifests, userAgent) ||
      fallbackManifest;

    return this.resolvedEntry;
  }
}

function findManifestForLocale(
  inlineLocaleManifests: Map<string, Manifest[]>,
  locale: string | undefined,
  userAgent: string,
) {
  const locales = getPossibleLocales(locale);
  for (const aLocale of locales) {
    const result = find(inlineLocaleManifests.get(aLocale), userAgent);
    if (result) {
      return result;
    }
  }

  return undefined;
}

function readGzipped(resolvedPath: string) {
  return readFile(resolvedPath)
    .then((zippedContent) => ungzip(zippedContent))
    .then((unzippedStr) => JSON.parse(unzippedStr.toString()));
}

const manifestsMapByPath: Map<
  string,
  Promise<ReturnType<typeof groupManifests>>
> = new Map();
function loadConsolidatedManifest(manifestPath: string, caching: boolean) {
  if (manifestsMapByPath.has(manifestPath) && caching) {
    return manifestsMapByPath.get(manifestPath)!;
  }

  const resolvedPath = join(appRoot.path, manifestPath);
  const resolvedZippedPath = `${resolvedPath}.gz`;
  const promise = pathExists(resolvedZippedPath)
    .then((gzippedVersionExists) => {
      return gzippedVersionExists
        ? readGzipped(resolvedZippedPath)
        : readJson(resolvedPath);
    })
    .then((manifests: Manifest[]) => {
      return groupManifests(manifests.map(backfillIdentity));
    });

  manifestsMapByPath.set(manifestPath, promise);

  return promise;
}

export function internalOnlyClearCache() {
  manifestsMapByPath.clear();
}

function find(manifests: Manifest[] | undefined, userAgent) {
  if (!manifests || manifests.length === 0) {
    return undefined;
  }

  if (!userAgent) {
    return manifests[manifests.length - 1];
  }

  return (
    manifests.find(
      ({browsers}) =>
        browsers == null ||
        matchesUA(userAgent, {
          browsers,
          ignoreMinor: true,
          ignorePatch: true,
          allowHigherVersions: true,
        }),
    ) || manifests[manifests.length - 1]
  );
}

function backfillIdentity(manifest: Manifest) {
  if (!manifest.identifier) {
    manifest.identifier = {target: manifest.name};
  }
  return manifest;
}

function groupManifests(manifests: Manifest[]) {
  const fallbackManifest = manifests[manifests.length - 1];
  const multiAsyncLanguageManifests = manifests.filter(
    (manifest) => !manifest.identifier || !manifest.identifier.locales,
  );

  return {
    fallbackManifest,
    multiAsyncLanguageManifests,
    inlineLocaleManifests: manifests.reduce(
      groupByLocale,
      new Map<string, ConsolidatedManifest>(),
    ),
  };
}

function groupByLocale(
  acc: Map<string, ConsolidatedManifest>,
  manifest: Manifest,
) {
  const locales = manifest.identifier!.locales;
  if (locales) {
    locales.forEach((locale) => {
      let manifests = acc.get(locale);
      if (!manifests) {
        manifests = [];
        acc.set(locale, manifests);
      }
      manifests.push(manifest);
    });
  }
  return acc;
}

function getPossibleLocales(locale: string | undefined) {
  if (!locale) {
    return [];
  }

  const split = locale.split('-');
  return split.length > 1
    ? [`${split[0]}-${split[1].toUpperCase()}`, split[0]]
    : [locale];
}
