import {I18nDetails, TranslationDictionary, MaybePromise} from './types';
import Connection from './connection';

export interface ConnectionState {
  loading: boolean;
  fallbacks: TranslationDictionary[];
  translations: TranslationDictionary[];
}

export interface Subscriber {
  (connectionState: ConnectionState): void;
}

export interface ConnectionResult {
  resolve(): Promise<void>;
  disconnect(): void;
}

export interface ExtractedTranslations {
  [key: string]: TranslationDictionary | null;
}

export default class Manager {
  get loading() {
    return this.translationPromises.size > 0;
  }

  private subscriptions = new Map<Subscriber, Connection>();
  private translations = new Map<string, TranslationDictionary | null>();
  private asyncTranslationIds: string[] = [];
  private translationPromises = new Map<string, Promise<void>>();

  constructor(
    public details: I18nDetails,
    initialTranslations: ExtractedTranslations = {},
  ) {
    for (const [id, translation] of Object.entries(initialTranslations)) {
      this.translations.set(id, translation);
      this.asyncTranslationIds.push(id);
    }
  }

  async resolve() {
    await Promise.all([...this.translationPromises.values()]);
  }

  extract() {
    return this.asyncTranslationIds.reduce<ExtractedTranslations>(
      (extracted, id) => ({
        ...extracted,
        [id]: this.translations.get(id) || null,
      }),
      {},
    );
  }

  connect(connection: Connection, subscriber: Subscriber): ConnectionResult {
    const possibleLocales = getPossibleLocales(this.details.locale);
    const promises: Promise<any>[] = [];

    for (const locale of possibleLocales) {
      const id = localeId(connection, locale);

      if (this.translations.has(id)) {
        continue;
      }

      if (this.translationPromises.has(id)) {
        // eslint-disable-next-line typescript/no-non-null-assertion
        promises.push(this.translationPromises.get(id)!);
        continue;
      }

      if (
        locale === this.details.fallbackLocale &&
        connection.fallbackTranslations
      ) {
        this.translations.set(id, connection.fallbackTranslations);
        continue;
      }

      const translations = connection.translationsForLocale(locale);
      if (isPromise(translations)) {
        const promise = translations
          .then(result => {
            this.asyncTranslationIds.push(id);
            this.translationPromises.delete(id);
            this.translations.set(id, result || null);
            this.updateSubscribersForId(id);
          })
          .catch(() => {
            this.asyncTranslationIds.push(id);
            this.translationPromises.delete(id);
            this.translations.set(id, null);
            this.updateSubscribersForId(id);
          });

        promises.push(promise);

        this.translationPromises.set(id, promise);
      } else {
        this.translations.set(id, translations || null);
      }
    }

    this.subscriptions.set(subscriber, connection);

    return {
      resolve: () => Promise.all(promises).then(() => undefined),
      disconnect: () => this.subscriptions.delete(subscriber),
    };
  }

  state(connection: Connection): ConnectionState {
    const parentState = connection.parent
      ? this.state(connection.parent)
      : {loading: false, translations: [], fallbacks: []};

    const fallbackTranslations = connection.fallbackTranslations
      ? [connection.fallbackTranslations]
      : [];

    const allFallbacks = [...fallbackTranslations, ...parentState.fallbacks];

    if (parentState.loading) {
      return {
        loading: true,
        fallbacks: allFallbacks,
        translations: allFallbacks,
      };
    }

    const possibleLocales = getPossibleLocales(this.details.locale, {
      exclude: this.details.fallbackLocale,
    });

    const translations = possibleLocales.map(locale => {
      const id = localeId(connection, locale);
      return (
        this.translations.get(id) || this.translationPromises.get(id) || null
      );
    });

    if (noPromises<TranslationDictionary | null>(translations)) {
      return {
        loading: false,
        fallbacks: allFallbacks,
        translations: [
          ...filterNull(translations),
          ...fallbackTranslations,
          ...parentState.translations,
        ],
      };
    } else {
      return {
        loading: true,
        fallbacks: allFallbacks,
        translations: allFallbacks,
      };
    }
  }

  update(details: I18nDetails) {
    this.details = details;
    const possibleLocales = getPossibleLocales(details.locale);

    for (const connection of this.subscriptions.values()) {
      for (const locale of possibleLocales) {
        const id = localeId(connection, locale);

        if (this.translations.has(id) || this.translationPromises.has(id)) {
          continue;
        }

        if (
          locale === this.details.fallbackLocale &&
          connection.fallbackTranslations
        ) {
          this.translations.set(id, connection.fallbackTranslations);
          continue;
        }

        const translations = connection.translationsForLocale(locale);

        if (isPromise(translations)) {
          this.translationPromises.set(
            id,
            translations
              .then(result => {
                this.asyncTranslationIds.push(id);
                this.translationPromises.delete(id);
                this.translations.set(id, result || null);
                this.updateSubscribersForId(id);
              })
              .catch(() => {
                this.asyncTranslationIds.push(id);
                this.translationPromises.delete(id);
                this.translations.set(id, null);
                this.updateSubscribersForId(id);
              }),
          );
        } else {
          this.translations.set(id, translations || null);
        }
      }
    }

    this.subscriptions.forEach((connection, subscription) => {
      subscription(this.state(connection));
    });
  }

  private updateSubscribersForId(id: string) {
    this.subscriptions.forEach((connection, subscriber) => {
      if (
        localeIdsForConnection(connection, this.details.locale).includes(id)
      ) {
        subscriber(this.state(connection));
      }
    });
  }
}

function localeIdsForConnection(
  connection: Connection,
  fullLocale: string,
): string[] {
  const parentLocaleIds = connection.parent
    ? localeIdsForConnection(connection.parent, fullLocale)
    : [];

  return [
    ...parentLocaleIds,
    ...getPossibleLocales(fullLocale).map(locale =>
      localeId(connection, locale),
    ),
  ];
}

function getPossibleLocales(
  locale: string,
  {exclude}: {exclude?: string} = {},
) {
  const normalizedLocale = locale.toLowerCase();
  const split = normalizedLocale.split('-');

  if (split.length > 1) {
    const locales = [`${split[0]}-${split[1].toUpperCase()}`, normalizedLocale];

    if (split[0] !== exclude) {
      locales.push(split[0]);
    }

    return locales;
  } else {
    return normalizedLocale === exclude ? [] : [normalizedLocale];
  }
}

function isPromise<T>(
  maybePromise: MaybePromise<T>,
): maybePromise is Promise<T> {
  return maybePromise != null && (maybePromise as any).then != null;
}

function filterNull<T>(array: (T | null)[]): T[] {
  return array.filter(Boolean) as T[];
}

function localeId(connection: Connection, locale: string) {
  return `${connection.id}__${locale}`;
}

function noPromises<T>(array: (T | Promise<any>)[]): array is T[] {
  return array.every(item => !isPromise(item));
}
