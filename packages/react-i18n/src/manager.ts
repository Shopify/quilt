import {I18nDetails, TranslationDictionary} from './types';
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
  disconnect(): void;
}

export interface ExtractedTranslations {
  [key: string]: TranslationDictionary | undefined;
}

export default class Manager {
  public loading = false;
  private subscriptions = new Map<Subscriber, Connection>();
  private translations: Map<
    string,
    | TranslationDictionary
    | Promise<TranslationDictionary | undefined>
    | undefined
  >;

  constructor(
    public details: I18nDetails,
    initialTranslations: ExtractedTranslations = {},
  ) {
    this.translations = new Map(Object.entries(initialTranslations));
  }

  async extract(): Promise<ExtractedTranslations> {
    const translationPairs = Array.from(this.translations.entries());
    const extractedTranslations: ExtractedTranslations = {};

    await Promise.all(
      translationPairs.map(async ([id, translationDictionary]) => {
        const resolvedTranslationDictionary = isPromise(translationDictionary)
          ? await translationDictionary
          : translationDictionary;
        extractedTranslations[id] = resolvedTranslationDictionary;
      }),
    );

    return extractedTranslations;
  }

  connect(connection: Connection, subscriber: Subscriber): ConnectionResult {
    const possibleLocales = getPossibleLocales(this.details.locale);

    for (const locale of possibleLocales) {
      const id = localeId(connection, locale);

      if (this.translations.has(id)) {
        continue;
      }

      const translations = connection.translationsForLocale(locale);

      if (isPromise(translations)) {
        this.translations.set(
          id,
          translations
            .then(result => {
              this.translations.set(id, result);
              this.updateSubscribersForId(id);
              return result;
            })
            .catch(() => {
              this.translations.set(id, undefined);
              this.updateSubscribersForId(id);
              return undefined;
            }),
        );
      } else {
        this.translations.set(id, translations);
      }
    }

    this.subscriptions.set(subscriber, connection);

    return {
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

    const possibleLocales = getPossibleLocales(this.details.locale);
    const translations = possibleLocales.map(locale =>
      this.translations.get(localeId(connection, locale)),
    );

    if (noPromises(translations)) {
      return {
        loading: false,
        fallbacks: allFallbacks,
        translations: [
          ...filterUndefined(translations),
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

        if (this.translations.has(id)) {
          continue;
        }

        const translations = connection.translationsForLocale(locale);

        if (isPromise(translations)) {
          this.translations.set(
            id,
            translations
              .then(result => {
                this.translations.set(id, result);
                this.updateSubscribersForId(id);
                return result;
              })
              .catch(() => {
                this.translations.set(id, undefined);
                this.updateSubscribersForId(id);
                return undefined;
              }),
          );
        } else {
          this.translations.set(id, translations);
        }
      }
    }

    for (const [subscription, connection] of this.subscriptions.entries()) {
      subscription(this.state(connection));
    }
  }

  private updateSubscribersForId(id: string) {
    for (const [subscriber, connection] of this.subscriptions.entries()) {
      if (
        localeIdsForConnection(connection, this.details.locale).includes(id)
      ) {
        subscriber(this.state(connection));
      }
    }
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

function getPossibleLocales(locale: string) {
  const normalizedLocale = locale.toLowerCase();
  const split = normalizedLocale.split('-');
  return split.length > 1 ? [normalizedLocale, split[0]] : [normalizedLocale];
}

function isPromise<T>(
  possiblePromise: T | Promise<T>,
): possiblePromise is Promise<T> {
  return possiblePromise != null && (possiblePromise as any).then != null;
}

function filterUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter(Boolean) as T[];
}

function localeId(connection: Connection, locale: string) {
  return `${connection.id}__${locale}`;
}

function noPromises<T>(array: (T | Promise<T>)[]): array is T[] {
  return array.every(item => !isPromise(item));
}
