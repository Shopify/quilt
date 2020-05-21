import {Browser, asPlainObject} from '../browser';

describe('Browser', () => {
  describe('supported', () => {
    it('uses the value supplied by the user', () => {
      expect(new Browser({userAgent: 'fake', supported: false}).supported).toBe(
        false,
      );
      expect(new Browser({userAgent: 'fake', supported: true}).supported).toBe(
        true,
      );
    });
  });

  describe('majorVersion', () => {
    it('returns the major version of the browser if present', () => {
      const userAgent =
        'Mozilla/5.0 (Linux; Android 6.0; ALE-L23 Build/HuaweiALE-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36';

      expect(new Browser({userAgent}).majorVersion).toBe(69);
    });

    it('returns undefined if a major version cannot be found', () => {
      const userAgent = 'Shopify Mobile/';

      expect(new Browser({userAgent}).majorVersion).toBeUndefined();
    });
  });

  describe('isNativeApp', () => {
    it('returns true for Shopify Mobile', () => {
      const userAgent =
        'Shopify Mobile/Android/8.12.0 (Build 12005 with API 28 on Google Android SDK built for x86) MobileMiddlewareSupported Mozilla/5.0 (Linux; Android 9; Android SDK built for x86 Build/PSR1.180720.075; wv)  AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36';

      expect(new Browser({userAgent}).isNativeApp).toBe(true);
    });

    it('returns false for other UA strings', () => {
      [
        'some-fake-UI/3.0.1 (nonsense) Apple Microsoft (XML like salamander)',
        'completely bogus UA',
        'Mozilla/5.0 (Linux; Android 6.0; ALE-L23 Build/HuaweiALE-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
      ].forEach(userAgent => {
        expect(new Browser({userAgent}).isNativeApp).toBe(false);
      });
    });
  });

  describe('isAndroidChrome', () => {
    it('returns true for Chrome on Android', () => {
      const userAgent =
        'Mozilla/5.0 (Linux; Android 6.0; ALE-L23 Build/HuaweiALE-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36';

      expect(new Browser({userAgent}).isAndroidChrome).toBe(true);
    });

    it('returns false when using a non-Chrome browser on Android', () => {
      const userAgent =
        'Mozilla/5.0 (Linux; U; Android 4.4.2; es-es; SM-T210R Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30';

      expect(new Browser({userAgent}).isAndroidChrome).toBe(false);
    });

    it('returns false for iOS userAgents', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1';

      expect(new Browser({userAgent}).isAndroidChrome).toBe(false);
    });
  });

  describe('os', () => {
    it('returns the os name', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1';

      expect(new Browser({userAgent}).os).toBe('iOS');
    });
  });

  describe('isMobile', () => {
    it('returns true when device type is mobile', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1';

      expect(new Browser({userAgent}).isMobile).toStrictEqual(true);
    });

    it('returns true when device type is tablet', () => {
      const userAgent =
        'Mozilla/5.0 (iPad; CPU OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1';

      expect(new Browser({userAgent}).isMobile).toStrictEqual(true);
    });

    it('returns false when device is a desktop', () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:69.0) Gecko/20100101 Firefox/69.0';

      expect(new Browser({userAgent}).isMobile).toStrictEqual(false);
    });
  });

  describe('isIOS', () => {
    it('returns true with standard iOS 9 userAgent', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on Mobile Shopify when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/5.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on Mobile Shopify when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns false on Mobile Shopify when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/10.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on POS when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/5.11.0 (iPad; iOS 9.3; Scale/2.00)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on POS when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/9.11.0 (iPad; iOS 9.3; Scale/2.00)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns false on POS when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/9.11.0 (iPad; iOS 10.3; Scale/2.00)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on Shopify Ping when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'Shopify Ping/iOS/5.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns true on Shopify Ping when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'Shopify Ping/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns false on Shopify Ping when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'Shopify Ping/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/10.1.2)';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(true);
    });

    it('returns false for an Android browser', () => {
      const userAgent =
        'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36';

      expect(new Browser({userAgent}).isIOS).toStrictEqual(false);
    });
  });

  describe('asPlainObject', () => {
    it('outputs userAgent details as a plain object', () => {
      const userAgent =
        'Mozilla/5.0 (Linux; Android 6.0; ALE-L23 Build/HuaweiALE-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36';

      const browser = asPlainObject(new Browser({userAgent}));

      expect(browser).toMatchObject({
        name: 'Chrome',
        version: '69.0.3497.100',
        isMobile: true,
        isNativeApp: false,
        isDesktop: false,
      });
    });
  });
});
