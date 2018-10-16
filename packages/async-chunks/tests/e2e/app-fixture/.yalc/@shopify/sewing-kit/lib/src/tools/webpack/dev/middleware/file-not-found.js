"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FileNotFound {
  constructor(publicPath) {
    this.publicPath = publicPath;
    this.assets = [];
    this.middleware = (request, response) => {
      const hrefs = this.assets.map(asset => {
        return {
          href: `${this.publicPath}${asset}`,
          name: asset.replace(/-[a-z0-9]{64}\./, '.')
        };
      });
      const message = `
        <head>
          <link rel="stylesheet" href="https://sdks.shopifycdn.com/polaris/2.5.0/polaris.min.css" />
        </head>
        <body style="padding: 0.8em;">
          <div class="Polaris-Page">
            <div class="Polaris-Page__Content">
              <div class="Polaris-Layout">
                <div class="Polaris-Layout__Section">
                  <div class="Polaris-TextContainer">
                    <h1 class="Polaris-Heading">404 - File not found</h1>
                    <h2 class="Polaris-Heading">${request.path} not found.</h2>
                  </div>
                </div>
                <div class="Polaris-Layout__Section">
                  <div class="Polaris-Card">
                    <div class="Polaris-Card__Header">
                      <h2 class="Polaris-Heading">Available assets</h2>
                    </div>
                    <div class="Polaris-Card__Section">
                      <ul class="Polaris-List Polaris-List--typeBullet">
                        ${hrefs.map(({ href, name }) => `<li class="Polaris-List__Item">
                                <a class="Polaris-Link" data-polaris-unstyled="true" href="${href}">${name}</a>
                              </li>`).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        `;
      response.contentType('text/html').status(404).send(message);
    };
  }
  update(stats) {
    this.assets = stats.compilation.chunks.reduce((assets, { files }) => {
      // eslint-disable-next-line no-param-reassign
      files = Array.isArray(files) ? files : [files];
      assets.push(...files);
      return assets;
    }, []).filter(asset => !asset.endsWith('.map'));
  }
}
exports.default = FileNotFound;