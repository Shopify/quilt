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

export interface Subscriber {
  (translations: TranslationDictionary[], details: I18nDetails): void;
}

export interface ConnectionResult {
  resolve(): Promise<void>;
  disconnect(): void;
}

export interface ExtractedTranslations {
  [id: string]: TranslationDictionary | undefined;
}

export default class Manager {
  get loading() {
    return this.translationPromises.size > 0;
  }

  private translationGetters = new Map<string, TranslationGetter>();
  private fallbacks = new Map<string, TranslationDictionary | undefined>();
  private translations = new Map<string, TranslationDictionary | undefined>();

  private asyncTranslationIds = new Set<string>();
  private subscriptions = new Map<Subscriber, string[]>();
  private translationPromises = new Set<Promise<void>>();

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
    await Promise.all([...this.translationPromises]);
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

    if (this.translationGetters.has(id)) {
      return;
    }

    const translationGetter = translations
      ? normalizeTranslationGetter(translations)
      : noop;

    this.setTranslations(id, translationGetter);
  }

  state(ids: string[]) {
    return ids.reduce<TranslationDictionary[]>((otherTranslations, id) => {
      const translationsForId: TranslationDictionary[] = [];

      for (const locale of getPossibleLocales(this.details.locale)) {
        const translationId = getTranslationId(id, locale);
        const translation = this.translations.get(translationId);
        if (translation != null) {
          translationsForId.push(translation);
        }
      }

      const fallback = this.fallbacks.get(id);
      if (fallback != null) {
        translationsForId.push(fallback);
      }

      return [...otherTranslations, ...translationsForId];
    }, []);
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
      subscriber(this.state(ids), details);
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
        this.asyncTranslationIds.add(translationId);

        const promise = translations
          .then(result => {
            this.translationPromises.delete(promise);
            this.translations.set(translationId, result);
            this.updateSubscribersForId(id);
          })
          .catch(() => {
            this.translationPromises.delete(promise);
            this.translations.set(translationId, undefined);
            this.updateSubscribersForId(id);
          });

        this.translationPromises.add(promise);
      } else {
        this.translations.set(translationId, translations);
      }
    }
  }

  private updateSubscribersForId(id: string) {
    for (const [subscriber, ids] of this.subscriptions) {
      if (ids.includes(id)) {
        subscriber(this.state(ids), this.details);
      }
    }
  }
}

function getPossibleLocales(locale: string) {
  const normalizedLocale = locale.toLowerCase();
  const split = normalizedLocale.split('-');
  return split.length > 1
    ? [`${split[0]}-${split[1].toUpperCase()}`, normalizedLocale, split[0]]
    : [normalizedLocale];
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
