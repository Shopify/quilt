import './matchers';

import Manager from '../manager';
import Connection from '../connection';

describe('Manager', () => {
  const basicDetails = {locale: 'en'};

  const en = {hello: 'Hello'};
  const enParent = {hello: 'Hello from parent'};
  const enUS = {hello: 'Howdy'};
  const enUSParent = {hello: 'Howdy from parent'};
  const fr = {hello: 'Bonjour'};
  const frParent = {hello: 'Bonjour du parent'};
  const frCA = {hello: '’Allo bonjour'};
  const frCAParent = {hello: '’Allo bonjour du parent'};

  const fallback = {hello: 'Uhh'};
  const fallbackParent = {hello: 'Umm'};

  function getTranslationParent(locale: string) {
    switch (locale) {
      case 'en':
        return enParent;
      case 'en-US':
        return enUSParent;
      case 'fr':
        return frParent;
      case 'fr-CA':
        return frCAParent;
    }

    return undefined;
  }

  function getTranslation(locale: string) {
    switch (locale) {
      case 'en':
        return en;
      case 'en-US':
        return enUS;
      case 'fr':
        return fr;
      case 'fr-CA':
        return frCA;
    }

    return undefined;
  }

  function getTranslationAsync(locale: string) {
    return Promise.resolve(getTranslation(locale));
  }

  describe('#connect()', () => {
    it('requests translations for connections', () => {
      const spy = jest.fn();
      const connection = new Connection({id: createID(), translations: spy});
      const manager = new Manager(basicDetails);
      manager.connect(
        connection,
        noop,
      );
      expect(spy).toHaveBeenCalledWith(basicDetails.locale);
    });

    it('requests translations only once for a given connection ID', () => {
      const spy = jest.fn();
      const id = createID();
      const manager = new Manager(basicDetails);

      manager.connect(
        new Connection({id, translations: spy}),
        noop,
      );
      manager.connect(
        new Connection({id, translations: spy}),
        noop,
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('requests translations for the full locale and language when the country code is provided', () => {
      const spy = jest.fn();
      const connection = new Connection({id: createID(), translations: spy});
      const manager = new Manager({...basicDetails, locale: 'en-US'});
      manager.connect(
        connection,
        noop,
      );
      expect(spy).toHaveBeenCalledWith('en-US');
      expect(spy).toHaveBeenCalledWith('en-US');
      expect(spy).toHaveBeenCalledWith('en');
    });

    describe('sync', () => {
      it('uses synchronously-returned translations, starting with the most specific translation', () => {
        const connection = new Connection({
          id: createID(),
          fallback,
          translations: getTranslation,
        });
        const manager = new Manager({...basicDetails, locale: 'fr-CA'});
        manager.connect(
          connection,
          noop,
        );
        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [frCA, fr, fallback],
        });
      });

      it('excludes translations that are undefined', () => {
        const connection = new Connection({
          id: createID(),
          translations(locale: string) {
            return locale === 'en' ? en : undefined;
          },
        });
        const manager = new Manager({...basicDetails, locale: 'en-US'});
        manager.connect(
          connection,
          noop,
        );
        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [en],
        });
      });

      it('uses a fallback when all translations are undefined', () => {
        const connection = new Connection({
          id: createID(),
          fallback,
          translations: getTranslation,
        });
        const manager = new Manager({...basicDetails, locale: 'pt-BR'});
        manager.connect(
          connection,
          noop,
        );
        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [fallback],
        });
      });

      it('does not call the subscription when all translations are synchronous', () => {
        const spy = jest.fn();
        const connection = new Connection({
          id: createID(),
          translations: getTranslation,
        });
        const manager = new Manager(basicDetails);
        manager.connect(
          connection,
          spy,
        );
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('async', () => {
      it('returns an empty loading state when no translations are returned synchronously', () => {
        const connection = new Connection({
          id: createID(),
          translations: getTranslationAsync,
        });
        const manager = new Manager(basicDetails);
        manager.connect(
          connection,
          noop,
        );
        expect(manager.state(connection)).toMatchObject({
          loading: true,
          translations: [],
        });
      });

      it('uses a fallback when all translations are async and loading', () => {
        const connection = new Connection({
          id: createID(),
          fallback,
          translations: getTranslationAsync,
        });
        const manager = new Manager(basicDetails);
        manager.connect(
          connection,
          noop,
        );
        expect(manager.state(connection)).toMatchObject({
          loading: true,
          translations: [fallback],
        });
      });

      it('uses a fallback when all translations resolve to be undefined', async () => {
        const promise = Promise.resolve(undefined);
        const connection = new Connection({
          id: createID(),
          fallback,
          translations: () => promise,
        });
        const manager = new Manager({...basicDetails, locale: 'pt-BR'});

        manager.connect(
          connection,
          noop,
        );
        await promise;

        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [fallback],
        });
      });

      it('uses a fallback when a subset of translations are async and loading', async () => {
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const connection = new Connection({
          id: createID(),
          fallback,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});

        manager.connect(
          connection,
          noop,
        );
        await frCATranslation.resolve();

        expect(manager.state(connection)).toMatchObject({
          loading: true,
          translations: [fallback],
        });
      });

      it('uses asynchronously-returned translations, starting with the most specific translation', async () => {
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const connection = new Connection({
          id: createID(),
          fallback,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});

        manager.connect(
          connection,
          noop,
        );
        await frCATranslation.resolve();
        await frTranslation.resolve();

        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [frCA, fr, fallback],
        });
      });

      it('uses asynchronous translations, excluding promises resolving to undefined', async () => {
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(undefined);

        const connection = new Connection({
          id: createID(),
          fallback,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});

        manager.connect(
          connection,
          noop,
        );
        await frCATranslation.resolve();
        await frTranslation.resolve();

        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [fr, fallback],
        });
      });

      it('uses asynchronous translations, excluding rejections', async () => {
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const connection = new Connection({
          id: createID(),
          fallback,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});

        manager.connect(
          connection,
          noop,
        );
        await frCATranslation.resolve();
        await frTranslation.reject();

        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [frCA, fallback],
        });
      });

      it('calls the subscription as each async translation is resolved', async () => {
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const connection = new Connection({
          id: createID(),
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});
        manager.connect(
          connection,
          spy,
        );

        expect(spy).not.toHaveBeenCalled();

        await frCATranslation.resolve();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(manager.state(connection));

        await frTranslation.resolve();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(manager.state(connection));
      });

      it('calls the subscription even when a translation rejects', async () => {
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const connection = new Connection({
          id: createID(),
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});
        manager.connect(
          connection,
          spy,
        );

        expect(spy).not.toHaveBeenCalled();

        await frCATranslation.reject();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(manager.state(connection));
      });
    });

    describe('parent', () => {
      it('uses all ancestor fallbacks and is loading when a parent is loading', () => {
        const parent = new Connection({
          id: createID(),
          fallback: fallbackParent,
          translations: getTranslationAsync,
        });

        const connection = parent.extend({
          id: createID(),
          fallback,
          translations: getTranslation,
        });

        const manager = new Manager(basicDetails);
        manager.connect(
          parent,
          noop,
        );
        manager.connect(
          connection,
          noop,
        );

        expect(manager.state(connection)).toMatchObject({
          loading: true,
          translations: [fallback, fallbackParent],
        });
      });

      it('uses all ancestor translations and own translations when available', () => {
        const parent = new Connection({
          id: createID(),
          fallback: fallbackParent,
          translations: getTranslationParent,
        });

        const connection = parent.extend({
          id: createID(),
          fallback,
          translations: getTranslation,
        });

        const manager = new Manager({...basicDetails, locale: 'en-US'});
        manager.connect(
          parent,
          noop,
        );
        manager.connect(
          connection,
          noop,
        );

        expect(manager.state(connection)).toMatchObject({
          loading: false,
          translations: [
            enUS,
            en,
            fallback,
            enUSParent,
            enParent,
            fallbackParent,
          ],
        });
      });

      it('uses only the nested fallbacks when own translations are loading but parents are loaded', () => {
        const parent = new Connection({
          id: createID(),
          fallback: fallbackParent,
          translations: getTranslationParent,
        });

        const connection = parent.extend({
          id: createID(),
          fallback,
          translations: getTranslationAsync,
        });

        const manager = new Manager({...basicDetails, locale: 'en-US'});
        manager.connect(
          parent,
          noop,
        );
        manager.connect(
          connection,
          noop,
        );

        expect(manager.state(connection)).toMatchObject({
          loading: true,
          translations: [fallback, fallbackParent],
        });
      });

      it('calls the subscription for children when parent translations resolve', async () => {
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const parent = new Connection({
          id: createID(),
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });

        const connection = parent.extend({
          id: createID(),
          translations: getTranslation,
        });

        const manager = new Manager({...basicDetails, locale: 'fr-CA'});
        manager.connect(
          parent,
          noop,
        );
        manager.connect(
          connection,
          spy,
        );

        expect(spy).not.toHaveBeenCalled();

        await frCATranslation.resolve();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(manager.state(connection));
      });
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('#update()', () => {});

  describe('#extract()', () => {
    it('provides an object with all async and sync translations keyed to unique IDs', async () => {
      const parent = new Connection({
        id: createID(),
        translations: getTranslationParent,
      });

      const connection = parent.extend({
        id: createID(),
        translations: getTranslationAsync,
      });

      const manager = new Manager({...basicDetails, locale: 'en-US'});

      manager.connect(
        parent,
        noop,
      );

      await manager
        .connect(
          connection,
          noop,
        )
        .resolve();

      const translationsByID = manager.extract();
      expect(Object.keys(translationsByID)).toBeArrayOfUniqueItems();
      // @ts-ignore (Object.values)
      const translations = Object.values(translationsByID);
      expect(translations).toContain(enUS);
      expect(translations).toContain(en);
      expect(translations).toContain(enUSParent);
      expect(translations).toContain(enParent);
    });

    it('does not provide async translations if they have not been resolved', async () => {
      const manager = new Manager({...basicDetails, locale: 'en-US'});
      const connection = new Connection({
        id: createID(),
        translations: getTranslationAsync,
      });

      // Connected, but not resolved
      const connectionResult = manager.connect(
        connection,
        noop,
      );

      const translationsByID = manager.extract();
      // @ts-ignore (Object.values)
      expect(Object.values(translationsByID)).toHaveLength(0);

      // Prevents leaving a hanging promise
      await connectionResult.resolve();
    });

    it('can use the extracted translations to make async translation resolution be synchronous', async () => {
      const manager = new Manager({...basicDetails, locale: 'fr-CA'});
      const connection = new Connection({
        id: createID(),
        translations: getTranslationAsync,
      });

      await manager
        .connect(
          connection,
          noop,
        )
        .resolve();

      const hydratedManager = new Manager(
        {...basicDetails, locale: 'fr-CA'},
        manager.extract(),
      );
      hydratedManager.connect(
        connection,
        noop,
      );

      expect(hydratedManager.state(connection)).toMatchObject({
        loading: false,
        translations: [frCA, fr],
      });
    });
  });
});

function noop() {}

let index = 0;
function createID() {
  return `MyComponent${index++}`;
}

interface TranslationPromise {
  promise: Promise<any>;
  resolve(): Promise<any>;
  reject(error?: Error): Promise<any>;
}

function createTranslationPromise(
  translation: {[key: string]: any} | undefined,
): TranslationPromise {
  let storedResolve: () => Promise<any>;
  let storedReject: (error?: any) => Promise<any>;

  const promise = new Promise<any>((resolve, reject) => {
    storedResolve = () => {
      resolve(translation);
      return promise;
    };

    storedReject = (error?: any) => {
      reject(error);
      return promise.catch(noop);
    };
  });

  // @ts-ignore (It thinks that the resolve/ reject are not assigned yet,
  // but promise does assign them synchronously in the callback)
  return {promise, resolve: storedResolve, reject: storedReject};
}
