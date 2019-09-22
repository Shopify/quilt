export default function redirectionScript({origin, redirectTo}) {
  return `
    <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function() {
        if (window.top === window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.location.href = '${redirectTo}';
        } else {
          // If the current window is the 'child', change the parent's URL with postMessage
          data = JSON.stringify({
            message: 'Shopify.API.remoteRedirect',
            data: { location: '${redirectTo}' }
          });

          window.parent.postMessage(data, '${origin}');
        }
      });
    </script>
  `;
}
