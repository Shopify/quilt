(function() {
  if (window.self !== window.parent) {
    return window.top.location.href = window.self.location.href;
  }

  function shouldDisplayPrompt() {
    return Boolean(document.hasStorageAccess);
  }

  function redirect() {
    sessionStorage.setItem('shopify.top_level_interaction', true);
    document.cookie = 'shopify.top_level_oauth=true';
    window.location.href = window.shopOrigin + "/admin/apps/" + window.apiKey + '/shopify/auth/enable_cookies?top_level=true';
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (shouldDisplayPrompt()) {
      document.getElementById('CookiePartitionPrompt').classList.remove('hide');
      document.getElementById('AcceptCookies')
        .addEventListener('click', redirect)
    } else {
      redirect();
    }
  });
})();
