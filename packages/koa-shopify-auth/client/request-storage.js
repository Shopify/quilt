(function() {
  function StorageAccessHelper() {
    this.hasStorageAccessUrl = window.redirectUrl + '&top_level=true';
    this.checkWindow();
    this.checkForStorageAccess();
  }

  StorageAccessHelper.prototype.checkWindow = function() {
    if (window.top === window.self) {
      debugger
      window.location.href = this.hasStorageAccessUrl;
    }
  }

  StorageAccessHelper.prototype.checkForStorageAccess = function() {
    if (this.hasStorageAccess()) {
      document.hasStorageAccess().then(function(hasAccess) {
        if (hasAccess) {
          this.handleHasStorageAccess();
        } else {
          this.handleGetStorageAccess();
        }
      }.bind(this));
    } else {
      this.redirectToAppHome();
    }
  }

  StorageAccessHelper.prototype.handleHasStorageAccess = function () {
    if (sessionStorage.getItem('shopify.granted_storage_access')) {
      // If app was classified by ITP and used Storage Access API to acquire access
      this.redirectToAppHome();
    } else {
      // If app has not been classified by ITP and still has storage access
      this.redirectToAppTLD();
    }
  }

  StorageAccessHelper.prototype.handleGetStorageAccess = function() {
    if (sessionStorage.getItem('shopify.top_level_interaction')) {
      // If merchant has been redirected to interact with TLD (requirement for prompting request to gain storage access)
      this.setupRequestStorageAccess();
    } else {
      // If merchant has not been redirected to interact with TLD (requirement for prompting request to gain storage access)
      this.redirectToAppTLD('/shopify/auth/top_level_interaction?shop=' + window.shop);
    }
  }

  StorageAccessHelper.prototype.setupRequestStorageAccess = function () {
    document.getElementById('CookiePartitionPrompt').classList.remove('hide');
    document.getElementById('AcceptCookies')
      .addEventListener('click', this.handleRequestStorageAccess.bind(this));
  }

  StorageAccessHelper.prototype.handleRequestStorageAccess = function () {
    document.requestStorageAccess().then(this.redirectToAppHome, this.redirectToAppsIndex);
  }

  StorageAccessHelper.prototype.hasStorageAccess = function() {
    return Boolean(document.hasStorageAccess);
  }

  StorageAccessHelper.prototype.redirectToAppHome = function() {
    sessionStorage.setItem('shopify.granted_storage_access', true);
    document.cookie = 'shopify.granted_storage_access=1';
    window.location.href = '/?shop=' + window.shop;
  }

  StorageAccessHelper.prototype.redirectToAppTLD = function(url) {
    var normalizedLink = document.createElement('a');
    normalizedLink.href = url;

    var data = JSON.stringify({
      message: 'Shopify.API.remoteRedirect',
      data: {
        location: normalizedLink.href,
      }
    });
    window.parent.postMessage(data, window.shopOrigin);
  }

  StorageAccessHelper.prototype.redirectToAppsIndex = function () {
    window.parent.location.href = `${window.shopOrigin}/admin/apps`;
  }

  document.addEventListener('DOMContentLoaded', new StorageAccessHelper());
})();
