/* eslint-env: browser */
(function(global) {
  function StorageAccessHelper(_window, _document) {
    this.window = _window;
    this.document = _document;
    this.hasStorageAccessUrl = this.window.redirectUrl + '&top_level=true';

    this.checkWindow();
    this.checkForStorageAccess();
  }

  StorageAccessHelper.prototype.checkWindow = function() {
    if (this.window.top === this.window.self) {
      this.window.location.href = this.hasStorageAccessUrl;
    }
  }

  StorageAccessHelper.prototype.checkForStorageAccess = function() {
    if (this.hasStorageAccess()) {
      this.document.hasStorageAccess().then(function(hasAccess) {
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
    if (this.document.sessionStorage.getItem('shopify.granted_storage_access')) {
      // If app was classified by ITP and used Storage Access API to acquire access
      this.redirectToAppHome();
    } else {
      // If app has not been classified by ITP and still has storage access
      this.redirectToAppTLD('/');
    }
  }

  StorageAccessHelper.prototype.handleGetStorageAccess = function() {
    if (this.document.sessionStorage.getItem('shopify.top_level_interaction')) {
      // If merchant has been redirected to interact with TLD (requirement for prompting request to gain storage access)
      this.setupRequestStorageAccess();
    } else {
      // If merchant has not been redirected to interact with TLD (requirement for prompting request to gain storage access)
      this.redirectToAppTLD('/shopify/auth/top_level_interaction?shop=' + this.window.shop);
    }
  }

  StorageAccessHelper.prototype.setupRequestStorageAccess = function () {
    this.document.getElementById('CookiePartitionPrompt').classList.remove('hide');
    this.document.getElementById('AcceptCookies')
      .addEventListener('click', this.handleRequestStorageAccess.bind(this));
  }

  StorageAccessHelper.prototype.handleRequestStorageAccess = function () {
    this.document.requestStorageAccess().then(
      this.redirectToAppHome.bind(this), this.redirectToAppsIndex.bind(this)
    );
  }

  StorageAccessHelper.prototype.hasStorageAccess = function() {
    return Boolean(this.document.hasStorageAccess);
  }

  StorageAccessHelper.prototype.redirectToAppHome = function() {
    this.document.sessionStorage.setItem('shopify.granted_storage_access', true);
    this.document.cookie = 'shopify.granted_storage_access=1';
    this.window.location.href = '/?shop=' + this.window.shop;
  }

  StorageAccessHelper.prototype.redirectToAppTLD = function(url) {
    var normalizedLink = this.document.createElement('a');
    normalizedLink.href = url;

    var data = JSON.stringify({
      message: 'Shopify.API.remoteRedirect',
      data: {
        location: normalizedLink.href,
      }
    });
    this.window.parent.postMessage(data, this.window.shopOrigin);
  }

  StorageAccessHelper.prototype.redirectToAppsIndex = function () {
    this.window.parent.location.href = `${this.window.shopOrigin}/admin/apps`;
  }

  if (typeof module === 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      new StorageAccessHelper(window, document);
    });
  } else {
    module.exports = StorageAccessHelper;
  }
})(this);
