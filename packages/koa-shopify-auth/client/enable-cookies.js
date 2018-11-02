(function() {
  function setCookieAndRedirect() {
    document.cookie = 'shopify.granted_storage_access=true';
    window.location.href = window.redirectUrl;
  }

  function shouldDisplayPrompt() {
    return Boolean(document.hasStorageAccess);
  }

  function shouldPromptStorageAccess() {
    return !navigator.userAgent.match(/Version\/12\.0\.?\d? Safari/);
  }

  function displayPrompt() {
    var itpContent = document.querySelector('#CookiePartitionPrompt');
    itpContent.style.display = 'block';
  }

  function requestStorage() {
    document.requestStorageAccess().then(setCookieAndRedirect, function() { alert('denied') });
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (shouldDisplayPrompt()) {
      if (shouldPromptStorageAccess()) {
        document.hasStorageAccess().then(function (hasAccess) {
          if (hasAccess) {
            setCookieAndRedirect();
          } else {
            displayPrompt();
            document.querySelector('#AcceptCookies')
              .addEventListener('click', requestStorage);
          }
        });
      } else {
        displayPrompt();
        var button = document.querySelector('#AcceptCookies');
        button.addEventListener('click', setCookieAndRedirect);
      }
    } else {
      setCookieAndRedirect();
    }
  });
})();
