// Copied from https://github.com/Shopify/shopify_app
const requestStorageAccess = (shop: string, prefix = '') => {
  const encodedShopUrl = encodeURIComponent(shop);
  return `(function() {
      function redirect() {
        var targetInfo = {
          myshopifyUrl: "https://${encodedShopUrl}",
          hasStorageAccessUrl: "${prefix}/auth/inline?shop=${encodedShopUrl}",
          doesNotHaveStorageAccessUrl:
            "${prefix}/auth/enable_cookies?shop=${encodedShopUrl}",
          appTargetUrl: "/?shop=${encodedShopUrl}"
        }

        if (window.top == window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.top.location.href = targetInfo.hasStorageAccessUrl;
        } else {
          var storageAccessHelper = new StorageAccessHelper(targetInfo);
          storageAccessHelper.execute();
        }
      }

      document.addEventListener("DOMContentLoaded", redirect);
    })();`;
};

export default requestStorageAccess;
