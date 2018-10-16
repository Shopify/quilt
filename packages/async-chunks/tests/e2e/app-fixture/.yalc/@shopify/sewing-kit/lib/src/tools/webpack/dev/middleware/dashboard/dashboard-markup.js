"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function dashboardMarkup(state) {
  const clientAssetsCardMarkup = getInitialStateMarkup(state);
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://sdks.shopifycdn.com/polaris/1.8.3/polaris.css">
  <link rel="icon" type="image/x-icon" href="http://example.com/favicon.ico" />

  <title>Dashboard Server</title>
</head>

<body>
  <div class="Polaris-Page">
    <div class="Polaris-Page__Header Polaris-Page__Header--hasSeparator">
      <div class="Polaris-Page__Title">
        <h1 class="Polaris-DisplayText Polaris-DisplayText--sizeLarge">Dashboard</h1>
      </div>
    </div>
    <div class="Polaris-Page__Content">
      <div class="Polaris-Card">
        <div class="Polaris-Card__Header">
          <h2 class="Polaris-Heading">Overview</h2>
        </div>
        <div class="Polaris-Card__Section">
          <dl class="Polaris-DescriptionList">
            <dt class="Polaris-DescriptionList__Term">Assets base URL</dt>
            <dd class="Polaris-DescriptionList__Description">${state.assetsBaseUrl}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="Polaris-Page__Content">
      <div class="Polaris-Card">
        <div class="Polaris-Card__Header">
          <h2 class="Polaris-Heading">Client assets</h2>
        </div>
        <div id="client-assets-card" class="Polaris-Card__Section">
          ${clientAssetsCardMarkup}
        </div>
      </div>
    </div>
  </div>

  <script type="text/javascript">
      function setMessage(message) {
        document.querySelector('#message').innerText = message;
      }

      ${clientAssetsList.toString()}

      function setClientAssetsList(assets) {
        document.querySelector('#client-assets-card').innerHTML = clientAssetsList(assets);
      }

      function connect() {
        const {href} = window.location;

        const event = new EventSource(
          href.endsWith('/')
            ? href + 'sk-dashboard-events'
            : href + '/sk-dashboard-events'
        );

        event.onopen = function(event) {
          console.log('event.onopen: ', event);
        };

        event.onerror = function(error) {;
          if (event.readyState === 2) {
            event.close();
            console.log('Reconnecting');
            setTimeout(connect, 500);
          }
        };

        event.onmessage = function({action, data}) {
          try {
            const state = JSON.parse(data);
            const client = state.client;

            if (client.state === null) {
              document.querySelector('#client-assets-card').innerHTML = '${gettingStarted}';
            } else if (client.state === 'compile'){
              document.querySelector('#client-assets-card').innerHTML = '${compilingClient}';
            } else if(client.state === 'done' && client.assets) {
              setClientAssetsList(client.assets);
            } else {
              console.log('state: ', state);
              document.querySelector('#client-assets-card').innerHTML = 'Uh oh... ¯\\_(ツ)_/¯';
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
exports.dashboardMarkup = dashboardMarkup;
const compilingClient = `<span class="Polaris-TextStyle--variationSubdued">🔨 Compiling client assets...</span>`;
const gettingStarted = `<span class="Polaris-TextStyle--variationSubdued">‍‍🏃‍♀️ Getting started...</span>`;
function getInitialStateMarkup(state) {
  const { client } = state;
  if (client.state === 'compile') {
    return compilingClient;
  } else if (client.state === 'done' && client.assets) {
    return clientAssetsList(client.assets);
  }
  return gettingStarted;
}
function clientAssetsList(assets) {
  const listItems = assets.map(asset => {
    return `
      <li class="Polaris-List__Item">
        <a class="Polaris-Link" data-polaris-unstyled="true" target="_blank" href="${asset.url}">${asset.filename}</a>
      </li>
    `;
  }).join('\n');
  return `
    <ul class="Polaris-List Polaris-List--typeBullet">
    ${listItems}
    </ul>
  `;
}