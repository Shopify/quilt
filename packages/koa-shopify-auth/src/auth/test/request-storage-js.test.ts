import StorageAccessHelper from '../../../client/request-storage';

describe('StorageAccessHelper', () => {
  const hasStorageAccessUrl = '/?shop=test-shop.myshopify.com';
  let fakeDocument;
  let fakeWindow;
  let helper;
  let mockSetupRequestStorageAccess;
  let originalSetupRequestStorageAccess;

  beforeEach(() => {
    originalSetupRequestStorageAccess =
      StorageAccessHelper.prototype.setupRequestStorageAccess;
    mockSetupRequestStorageAccess = jest.fn();
    StorageAccessHelper.prototype.setupRequestStorageAccess = mockSetupRequestStorageAccess;
    fakeDocument = {
      createElement: jest.fn().mockReturnValue({href: 'test'}),
      sessionStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
    };
    fakeWindow = {
      redirectUrl: hasStorageAccessUrl,
      top: 'top',
      self: 'self',
      location: {
        href: '/auth/request_storage?shop=test-shop.myshopify.com',
      },
      shop: 'test-shop.myshopify.com',
      shopOrigin: 'https://test-shop.myshopify.com',
    };
  });

  afterEach(() => {
    StorageAccessHelper.prototype.setupRequestStorageAccess = originalSetupRequestStorageAccess;
  });

  describe('checkWindow', () => {
    it('redirects to hasStorageAccessUrl if top window', () => {
      fakeWindow.top = fakeWindow.self;
      const checkForStorageAccess =
        StorageAccessHelper.prototype.checkForStorageAccess;
      StorageAccessHelper.prototype.checkForStorageAccess = jest.fn();
      helper = new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(fakeWindow.location.href).toEqual(
        `${hasStorageAccessUrl}&top_level=true`,
      );
      StorageAccessHelper.prototype.checkForStorageAccess = checkForStorageAccess;
    });
  });

  describe('checkForStorageAccess', () => {
    it('redirects to app home if user agent does not have storage access API', () => {
      fakeDocument.hasStorageAccess = false;
      helper = new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(fakeWindow.location.href).toEqual(
        '/?shop=test-shop.myshopify.com',
      );
    });

    it('redirects to app TLD if app has access and has not been classified by ITP', async () => {
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(true);
        });
      });
      const postMessage = jest.fn();
      fakeWindow.parent = {
        postMessage,
      };
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(postMessage).toHaveBeenCalledWith(
        '{"message":"Shopify.API.remoteRedirect","data":{"location":"/"}}',
        'https://test-shop.myshopify.com',
      );
    });

    it('requests storage access if app has access and has been classified by ITP', async () => {
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(true);
        });
      });
      fakeDocument.sessionStorage.getItem = jest.fn().mockReturnValue(true);
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(fakeDocument.sessionStorage.setItem).toHaveBeenCalledWith(
        'shopify.granted_storage_access',
        true,
      );
      expect(fakeDocument.cookie).toEqual('shopify.granted_storage_access=1');
      expect(fakeWindow.location.href).toEqual(
        '/?shop=test-shop.myshopify.com',
      );
    });

    it("redirects to top level interaction if app doesn't have access and user has not interacted", async () => {
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(false);
        });
      });
      const postMessage = jest.fn();
      fakeWindow.parent = {
        postMessage,
      };
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(postMessage).toHaveBeenCalledWith(
        '{"message":"Shopify.API.remoteRedirect","data":{"location":"/shopify/auth/top_level_interaction?shop=test-shop.myshopify.com"}}',
        'https://test-shop.myshopify.com',
      );
    });

    it("sets up request storage access UI if app doesn't have access and has been classified by ITP", async () => {
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(false);
        });
      });
      fakeDocument.sessionStorage.getItem = jest.fn().mockReturnValue(true);
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      expect(mockSetupRequestStorageAccess).toHaveBeenCalled();
    });
  });

  describe('handleRequestStorageAccess', () => {
    it('redirects to app home if storage access is granted', async () => {
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(false);
        });
      });
      fakeDocument.sessionStorage.getItem = jest.fn().mockReturnValue(true);
      fakeDocument.requestStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(true);
        });
      });
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      await helper.handleRequestStorageAccess();
      expect(fakeDocument.sessionStorage.setItem).toHaveBeenCalledWith(
        'shopify.granted_storage_access',
        true,
      );
      expect(fakeDocument.cookie).toEqual('shopify.granted_storage_access=1');
      expect(fakeWindow.location.href).toEqual(
        '/?shop=test-shop.myshopify.com',
      );
    });

    it('redirects to app home if storage access is granted', async () => {
      fakeWindow.parent = {location: {href: ''}};
      fakeDocument.hasStorageAccess = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          return resolve(false);
        });
      });
      fakeDocument.sessionStorage.getItem = jest.fn().mockReturnValue(true);
      fakeDocument.requestStorageAccess = jest.fn().mockImplementation(() => {
        /* eslint-disable-next-line promise/param-names */
        return new Promise((_, reject) => {
          return reject();
        });
      });
      helper = await new StorageAccessHelper(fakeWindow, fakeDocument);
      await helper.handleRequestStorageAccess();
      expect(fakeWindow.parent.location.href).toEqual(
        'https://test-shop.myshopify.com/admin/apps',
      );
    });
  });
});
