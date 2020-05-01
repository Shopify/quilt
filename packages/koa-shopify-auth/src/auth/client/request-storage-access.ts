// Copied from https://github.com/Shopify/shopify_app
const requestStorageAccess = (shop: string) => {
  return `(function() {
      function redirect() {
        var targetInfo = {
          myshopifyUrl: "https://${shop}",
          hasStorageAccessUrl: "/auth/inline?shop=${shop}",
          doesNotHaveStorageAccessUrl: "/auth/enable_cookies?shop=${shop}",
          appTargetUrl: "/?shop=${shop}"
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
