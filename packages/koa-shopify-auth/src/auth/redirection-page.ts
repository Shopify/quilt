export default function redirectionScript({origin, redirectTo, apiKey}) {
  return `
    <button id="AcceptCookies">Request storage access</button>
    <script src="https://unpkg.com/@shopify/app-bridge@^1"></script> <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function() {
        if (window.top === window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.location.href = '${redirectTo}';
        } else {
          var promise = document.requestStorageAccess();
          promise.then(
            function () {
              // If the current window is the 'child', change the parent's URL with postMessage
              var AppBridge = window['app-bridge'];
              var createApp = AppBridge.default;
              var Redirect = AppBridge.actions.Redirect;
              var app = createApp({
                apiKey: '${apiKey}',
                shopOrigin: '${origin}',
              });
              var redirect = Redirect.create(app);
              redirect.dispatch(Redirect.Action.REMOTE, '${redirectTo}');
            },
            function () {
              var button = document.querySelector('#AcceptCookies');
              button.addEventListener('click', requesty);
            }
          );
        }
      });
      function requesty () {
        var promise = document.requestStorageAccess();
        promise.then(
          function () {
            // If the current window is the 'child', change the parent's URL with postMessage
            console.log("it was accepted");
            var AppBridge = window['app-bridge'];
            var createApp = AppBridge.default;
            var Redirect = AppBridge.actions.Redirect;
            var app = createApp({
              apiKey: '${apiKey}',
              shopOrigin: '${origin}',
            });
            var redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.REMOTE, '${redirectTo}');
          },
          function () {
            console.log("it was rejected");
          }
        );
      }
    </script>
  `;
}
