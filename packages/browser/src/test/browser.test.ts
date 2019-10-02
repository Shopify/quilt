import {Browser} from '../browser';

describe('Browser', () => {
  describe('majorVersion', () => {});

  describe('isNativeApp', () => {});

  describe('isAndroidChrome', () => {});

  describe('isIOS9()', () => {
    it('returns true with standard iOS 9 userAgent', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns true on Mobile Shopify when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/5.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns true on Mobile Shopify when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns false on Mobile Shopify when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'Shopify Mobile/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/10.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(false);
    });

    it('returns true on POS when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/5.11.0 (iPad; iOS 9.3; Scale/2.00)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns true on POS when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/9.11.0 (iPad; iOS 9.3; Scale/2.00)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns false on POS when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'com.jadedpixel.pos Shopify POS/9.11.0 (iPad; iOS 10.3; Scale/2.00)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(false);
    });

    it('returns true on Shopify Ping when iOS version is 9 and app version is not 9', () => {
      const userAgent =
        'Shopify Ping/iOS/5.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns true on Shopify Ping when iOS version is 9 and app version is 9', () => {
      const userAgent =
        'Shopify Ping/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/9.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(true);
    });

    it('returns false on Shopify Ping when iOS version is not 9 but app version is 9', () => {
      const userAgent =
        'Shopify Ping/iOS/9.3.1 (iPad8,1 Simulator/com.shopify.ShopifyInternal/10.1.2)';
      expect(new Browser({userAgent}).isIOS9).toStrictEqual(false);
    });
  });

  describe('asPlainObject', () => {});
});
