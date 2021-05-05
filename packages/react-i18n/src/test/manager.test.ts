import './matchers';

import {animationFrame} from '@shopify/jest-dom-mocks';

import {I18nManager} from '../manager';

describe('I18nManager', () => {
  beforeEach(() => {
    animationFrame.mock();
  });

  afterEach(() => {
    animationFrame.restore();
  });

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
      const locale = 'fr';
      const manager = new I18nManager({...basicDetails, locale});
      manager.register({id: createID(), translations: spy});
      expect(spy).toHaveBeenCalledWith(locale);
    });

    it('requests translations only once for a given connection ID', () => {
      const spy = jest.fn();
      const id = createID();
      const manager = new I18nManager(basicDetails);

      manager.register({id, translations: spy});
      manager.register({id, translations: spy});

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('requests translations for the full locale and language when the country code is provided', () => {
      const spy = jest.fn();
      const manager = new I18nManager({...basicDetails, locale: 'en-US'});
      manager.register({id: createID(), translations: spy});
      expect(spy).toHaveBeenCalledWith('en-US');
      expect(spy).toHaveBeenCalledWith('en');
    });

    it('does not request translations when the fallback locale matches the locale', () => {
      const spy = jest.fn();
      const manager = new I18nManager({
        ...basicDetails,
        fallbackLocale: 'en',
        locale: 'en',
      });
      manager.register({id: createID(), translations: spy, fallback: {}});
      expect(spy).not.toHaveBeenCalled();
    });

    describe('sync', () => {
      it('uses synchronously-returned translations, starting with the most specific translation', () => {
        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});
        const id = createID();
        manager.register({
          id,
          fallback,
          translations: getTranslation,
        });
        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [frCA, fr, fallback],
        });
      });

      it('excludes translations that are undefined', () => {
        const id = createID();
        const manager = new I18nManager({...basicDetails, locale: 'en-US'});
        manager.register({
          id,
          translations(locale: string) {
            return locale === 'en' ? en : undefined;
          },
        });
        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [en],
        });
      });

      it('uses a fallback when all translations are undefined', () => {
        const id = createID();
        const manager = new I18nManager({...basicDetails, locale: 'pt-BR'});
        manager.register({
          id,
          fallback,
          translations: getTranslation,
        });
        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [fallback],
        });
      });

      it('does not call the subscription when all translations are synchronous', () => {
        const id = createID();
        const spy = jest.fn();
        const manager = new I18nManager(basicDetails);
        manager.register({
          id,
          translations: getTranslation,
        });
        manager.subscribe([id], spy);

        expect(spy).not.toHaveBeenCalled();
      });

      it('does not include fallback translations if they are the same language as the request', () => {
        const id = createID();
        const manager = new I18nManager({
          ...basicDetails,
          locale: 'en',
          fallbackLocale: 'en',
        });

        manager.register({
          id,
          fallback: en,
          translations: () => en,
        });

        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [en],
        });
      });
    });

    describe('async', () => {
      it('returns an empty loading state when no translations are returned synchronously', () => {
        const id = createID();
        const manager = new I18nManager(basicDetails);
        manager.register({
          id,
          translations: getTranslationAsync,
        });
        expect(manager.state([id])).toMatchObject({
          loading: true,
          translations: [],
        });
      });

      it('uses a fallback when all translations are async and loading', () => {
        const id = createID();
        const manager = new I18nManager(basicDetails);
        manager.register({
          id,
          fallback,
          translations: getTranslationAsync,
        });

        expect(manager.state([id])).toMatchObject({
          loading: true,
          translations: [fallback],
        });
      });

      it('uses a fallback when all translations resolve to be undefined', async () => {
        const id = createID();
        const promise = Promise.resolve(undefined);
        const manager = new I18nManager({...basicDetails, locale: 'pt-BR'});

        manager.register({
          id,
          fallback,
          translations: () => promise,
        });

        await promise;

        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [fallback],
        });
      });

      it('uses asynchronously-returned translations, starting with the most specific translation', async () => {
        const id = createID();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
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
        await frCATranslation.resolve();
        await frTranslation.resolve();

        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [frCA, fr, fallback],
        });
      });

      it('uses asynchronous translations, excluding promises resolving to undefined', async () => {
        const id = createID();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(undefined);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
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
        await frCATranslation.resolve();
        await frTranslation.resolve();

        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [fr, fallback],
        });
      });

      it('uses asynchronous translations, excluding rejections', async () => {
        const id = createID();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
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
        await frCATranslation.resolve();
        await frTranslation.reject();

        expect(manager.state([id])).toMatchObject({
          loading: false,
          translations: [frCA, fallback],
        });
      });

      it('calls the subscription as each async translation is resolved', async () => {
        const id = createID();
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });
        manager.subscribe([id], spy);

        expect(spy).not.toHaveBeenCalled();

        await frCATranslation.resolve();
        animationFrame.runFrame();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(manager.state([id]), manager.details);

        await frTranslation.resolve();
        animationFrame.runFrame();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(manager.state([id]), manager.details);
      });

      it('enqueues multiple translations resolving into the same frame', async () => {
        const id = createID();
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);
        const frCATranslation = createTranslationPromise(frCA);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
          translations(locale: string) {
            if (locale === 'fr-CA') {
              return frCATranslation.promise;
            } else if (locale === 'fr') {
              return frTranslation.promise;
            }

            return undefined;
          },
        });
        manager.subscribe([id], spy);

        await frCATranslation.resolve();
        await frTranslation.resolve();

        expect(spy).not.toHaveBeenCalled();

        animationFrame.runFrame();

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('does not call the subscription when a translation resolves to undefined', async () => {
        const id = createID();
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(undefined);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
          translations: () => frTranslation.promise,
        });
        manager.subscribe([id], spy);

        await frTranslation.resolve();
        expect(spy).not.toHaveBeenCalled();
      });

      it('does not call the subscription when a translation rejects', async () => {
        const id = createID();
        const spy = jest.fn();
        const frTranslation = createTranslationPromise(fr);

        const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});

        manager.register({
          id,
          translations: () => frTranslation.promise,
        });
        manager.subscribe([id], spy);

        await frTranslation.reject();
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('#update()', () => {});

  describe('#extract()', () => {
    it('provides an object with all async translations keyed to unique IDs', async () => {
      const manager = new I18nManager({...basicDetails, locale: 'en-US'});

      manager.register({
        id: createID(),
        translations: getTranslationParent,
      });

      manager.register({
        id: createID(),
        translations: getTranslationAsync,
      });

      await manager.resolve();

      const translationsByID = manager.extract();
      expect(Object.keys(translationsByID)).toBeArrayOfUniqueItems();

      const translations = Object.values(translationsByID);
      expect(translations).toContain(enUS);
      expect(translations).toContain(en);
    });

    it('does not provide async translations if they have not been resolved', () => {
      const manager = new I18nManager({...basicDetails, locale: 'en-US'});

      manager.register({
        id: createID(),
        translations: getTranslationAsync,
      });

      const translationsByID = manager.extract();
      expect(Object.values(translationsByID)).toHaveLength(0);
    });

    it('does not provide synchronous translations', async () => {
      const manager = new I18nManager({...basicDetails, locale: 'en-US'});
      manager.register({
        id: createID(),
        translations: getTranslation,
      });

      await manager.resolve();

      const translationsByID = manager.extract();
      expect(Object.values(translationsByID)).toHaveLength(0);
    });

    it('can use the extracted translations to make async translation resolution be synchronous', async () => {
      const manager = new I18nManager({...basicDetails, locale: 'fr-CA'});
      const options = {
        id: createID(),
        translations: getTranslationAsync,
      };

      manager.register(options);

      await manager.resolve();

      const hydratedI18nManager = new I18nManager(
        {...basicDetails, locale: 'fr-CA'},
        manager.extract(),
      );

      hydratedI18nManager.register(options);

      expect(hydratedI18nManager.state([options.id])).toMatchObject({
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

  // @ts-expect-error It thinks that the resolve/ reject are not assigned yet
  return {promise, resolve: storedResolve, reject: storedReject};
}
