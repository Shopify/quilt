import {I18nDetails, TranslationDictionary, MaybePromise} from './types';

export interface ConnectionState {
  loading: boolean;
  fallbacks: TranslationDictionary[];
  translations: TranslationDictionary[];
}

type TranslationGetter = (
  locale: string,
) => MaybePromise<TranslationDictionary | undefined>;

type TranslationMap = {
  [key: string]: MaybePromise<TranslationDictionary | undefined>;
};

export interface RegisterOptions {
  id: string;
  translations?: TranslationGetter | TranslationMap;
  fallback?: TranslationDictionary;
}

interface TranslationState {
  loading: boolean;
  translations: TranslationDictionary[];
}

export interface Subscriber {
  (translations: TranslationState, details: I18nDetails): void;
}

export interface ConnectionResult {
  resolve(): Promise<void>;
  disconnect(): void;
}

export interface ExtractedTranslations {
  [id: string]: TranslationDictionary | undefined;
}

export class I18nManager {
  get loading() {
    return this.translationPromises.size > 0;
  }

  private translationGetters = new Map<string, TranslationGetter>();
  private fallbacks = new Map<string, TranslationDictionary | undefined>();
  private translations = new Map<string, TranslationDictionary | undefined>();

  private asyncTranslationIds = new Set<string>();
  private subscriptions = new Map<Subscriber, string[]>();
  private translationPromises = new Map<string, Promise<void>>();

  private idsToUpdate = new Set<string>();
  private enqueuedUpdate?: number;

  constructor(
    public details: I18nDetails,
    initialTranslations: ExtractedTranslations = {},
  ) {
    for (const [id, translation] of Object.entries(initialTranslations)) {
      this.translations.set(id, translation);
      this.asyncTranslationIds.add(id);
    }
  }

  async resolve() {
    await Promise.all([...this.translationPromises.values()]);
  }

  extract() {
    return [...this.asyncTranslationIds].reduce<ExtractedTranslations>(
      (extracted, id) => ({
        ...extracted,
        [id]: this.translations.get(id),
      }),
      {},
    );
  }

  register({id, translations, fallback}: RegisterOptions) {
    if (!this.fallbacks.has(id)) {
      this.fallbacks.set(id, fallback);
    }

    if (this.details.fallbackLocale != null && fallback != null) {
      const translationId = getTranslationId(id, this.details.fallbackLocale);

      if (!this.translations.has(translationId)) {
        this.translations.set(translationId, fallback);
      }
    }

    if (this.translationGetters.has(id)) {
      return;
    }

    const translationGetter = translations
      ? normalizeTranslationGetter(translations)
      : noop;

    this.setTranslations(id, translationGetter);
  }

  state(ids: string[]) {
    const {locale, fallbackLocale} = this.details;
    const possibleLocales = getPossibleLocales(locale);
    const omitFallbacks =
      fallbackLocale != null && possibleLocales.includes(fallbackLocale);

    let loading = false;
    let hasUnresolvedTranslations = false;

    const translations = ids.reduce<TranslationDictionary[]>(
      (otherTranslations, id) => {
        const translationsForId: TranslationDictionary[] = [];

        for (const locale of possibleLocales) {
          const translationId = getTranslationId(id, locale);
          const translation = this.translations.get(translationId);

          if (translation == null) {
            if (this.translationPromises.has(translationId)) {
              hasUnresolvedTranslations = true;
            }
          } else {
            translationsForId.push(translation);
          }
        }

        if (translationsForId.length === 0 && hasUnresolvedTranslations) {
          loading = true;
        }

        if (!omitFallbacks) {
          const fallback = this.fallbacks.get(id);
          if (fallback != null) {
            translationsForId.push(fallback);
          }
        }

        return [...otherTranslations, ...translationsForId];
      },
      [],
    );

    return {loading, translations};
  }

  subscribe(ids: string[], subscriber: Subscriber) {
    this.subscriptions.set(subscriber, ids);
    return () => {
      this.subscriptions.delete(subscriber);
    };
  }

  update(details: I18nDetails) {
    this.details = details;

    for (const [id, translationGetter] of this.translationGetters) {
      this.setTranslations(id, translationGetter);
    }

    for (const [subscriber, ids] of this.subscriptions) {
      subscriber(this.state(ids), this.details);
    }
  }

  private setTranslations(id: string, translationGetter: TranslationGetter) {
    this.translationGetters.set(id, translationGetter);

    for (const locale of getPossibleLocales(this.details.locale)) {
      const translationId = getTranslationId(id, locale);

      if (this.translations.has(translationId)) {
        continue;
      }

      const translations = translationGetter(locale);

      if (isPromise(translations)) {
        const promise = translations
          .then(result => {
            this.translationPromises.delete(translationId);
            this.translations.set(translationId, result);
            this.asyncTranslationIds.add(translationId);

            if (result != null) {
              this.updateSubscribersForId(id);
            }
          })
          .catch(() => {
            this.translationPromises.delete(translationId);
            this.translations.set(translationId, undefined);
            this.asyncTranslationIds.add(translationId);
          });

        this.translationPromises.set(translationId, promise);
      } else {
        this.translations.set(translationId, translations);
      }
    }
  }

  private updateSubscribersForId(id: string) {
    this.idsToUpdate.add(id);

    if (this.enqueuedUpdate != null) {
      return;
    }

    const isBrowser = typeof window !== 'undefined';
    const enqueue = isBrowser ? window.requestAnimationFrame : setImmediate;

    this.enqueuedUpdate = (enqueue as (callback: () => void) => number)(() => {
      delete this.enqueuedUpdate;

      const idsToUpdate = [...this.idsToUpdate];
      this.idsToUpdate.clear();

      for (const [subscriber, ids] of this.subscriptions) {
        if (ids.some(id => idsToUpdate.includes(id))) {
          subscriber(this.state(ids), this.details);
        }
      }
    });
  }
}

function getPossibleLocales(locale: string) {
  const split = locale.split('-');
  return split.length > 1
    ? [`${split[0]}-${split[1].toUpperCase()}`, split[0]]
    : [locale];
}

function isPromise<T>(
  maybePromise: MaybePromise<T>,
): maybePromise is Promise<T> {
  return maybePromise != null && (maybePromise as any).then != null;
}

function getTranslationId(id: string, locale: string) {
  return `${id}__${locale}`;
}

function noop() {
  return undefined;
}

function normalizeTranslationGetter(
  translations: TranslationMap | TranslationGetter,
): TranslationGetter {
  return typeof translations === 'function'
    ? translations
    : (locale: string) => translations[locale];
}
