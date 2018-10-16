"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function warmupMarkup(workspace, referer) {
  const backgroundImages = ['warmup-background.svg', 'warmup-gal-background.svg'];
  const backgroundImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  const resolvedReferer = Array.isArray(referer) ? referer[0] : referer;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://sdks.shopifycdn.com/polaris/1.8.3/polaris.css">
      <title>Warmup Server</title>
      <style>
        #errors {
          background: white;
          border: 1px solid black;
          max-height: 500px;
          overflow: scroll;
          padding: 20px;
        }

        #errors.hidden {
          display: none;
        }
      </style>
  </head>
  <body>
    <div class="Polaris-Page">
      <div class="Polaris-EmptyState">
        <div class="Polaris-EmptyState__Section">
          <div class="Polaris-EmptyState__DetailsContainer">
            <div class="Polaris-EmptyState__Details">
              <div class="Polaris-TextContainer">
                <p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">Hang tight!</p>
                <div class="Polaris-EmptyState__Content">
                  <p id="message">Bundles are being built.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="Polaris-EmptyState__ImageContainer">
            <img src="//sdks.shopifycdn.com/images/${backgroundImage}" role="presentation" alt="" class="Polaris-EmptyState__Image" />
          </div>
        </div>
      </div>
      <pre id="errors" class="hidden"></pre>
      <div class="Polaris-Banner" tabindex="0" role="status" aria-live="polite" aria-labelledby="Banner13Heading" aria-describedby="Banner13Content">
        <div class="Polaris-Banner__Ribbon"><span class="Polaris-Icon Polaris-Icon--colorInkLighter Polaris-Icon--hasBackdrop"><svg class="Polaris-Icon__Svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2V6H9v4zm0 4h2v-2H9v2z" fill-rule="evenodd"></path></svg></span></div>
        <div>
          <div class="Polaris-Banner__Heading" id="Banner13Heading">
            <p class="Polaris-Heading">Did you know?</p>
          </div>
          <div class="Polaris-Banner__Content" id="Banner13Content">
            <p>You can view this project's logs using \`dev sv logs -f ${workspace.name}\`</p>
          </div>
        </div>
      </div>
    </div>
    <script type="text/javascript">
      const HTTP_REFERER = ${resolvedReferer == null ? 'null' : `'${resolvedReferer}'`};

      function setMessage(message) {
        document.querySelector('#message').innerText = message;
      }

      function showErrors(errors) {
        document.querySelector('#errors').innerHTML = errors;
        document.querySelector('#errors').classList.remove('hidden');
      }

      function hideErrors() {
        document.querySelector('#errors').classList.add('hidden');
      }

      function connect() {
        const {href} = window.location;
        const event = new EventSource(
          href.endsWith('/')
            ? href + 'sk-status'
            : href + '/sk-status'
        );

        event.onopen = function() {
          // eslint-disable-next-line no-console
          console.log('open', arguments);
        };

        event.onerror = function() {
          // eslint-disable-next-line no-console
          console.log('error', arguments);
          if (event.readyState === 2) {
            event.close();
            console.log('Reconnecting');
            setTimeout(connect, 500);
          }
        };

        event.onmessage = function(message) {
          const {action, data} = message;
          try {
            const state = JSON.parse(data);
            // eslint-disable-next-line no-console
            console.log(state);

            if (state.message) {
              setMessage(state.message);
            }

            if (state.errors) {
              showErrors(state.errors.join('\\n'));
            } else {
              hideErrors();
            }

            if (state.warmupComplete) {
              event.close();
              /*
               * This fudges around the real server taking a few seconds to start up.
               * Avoids the "It looks like the shopify server is not yet running on OS X." message.
               * Once 'sk-status' is handled by the assets server, this will be less hacky.
               */
              setTimeout(() => {
                if (HTTP_REFERER) {
                  location.assign(HTTP_REFERER);
                } else {
                  location.reload();
                }
              }, 3000);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log('EventSource error', data, err);
          }
        }
      }
      connect();
    </script>
  </body>
  </html>
`;
}
exports.warmupMarkup = warmupMarkup;