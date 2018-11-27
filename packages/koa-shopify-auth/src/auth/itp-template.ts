import {readFileSync} from 'fs';
import {join} from 'path';
import {Context} from 'koa';

export interface TemplateData {
  shop: string;
  heading: string;
  body: string;
  footer?: string;
  action: string;
  script: string;
}

export function readTemplate(fname: string) {
  return readFileSync(join(__dirname, '../../client', fname)).toString();
}

const CSS = readTemplate('auth.css');

export default function itpTemplate(ctx: Context, data: TemplateData) {
  const footerMarkup = data.footer
    ? `
<div class="Polaris-Card__Section Polaris-Card__Section--subdued">
  <p>${data.footer}</p>
</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${CSS}
  </style>
  <base target="_top">
  <title>Redirecting…</title>

  <script>
    window.apiKey = "${ctx.state.apiKey}";
    window.shopOrigin = "https://${data.shop}";
    window.redirectUrl = "${ctx.state.authRoute}?shop=${data.shop}";
  </script>
</head>
<body>
  <main id="CookiePartitionPrompt" class="hide">
    <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__Section">
            <div class="Polaris-Stack Polaris-Stack--vertical">
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Header">
                    <h1 class="Polaris-Heading">${data.heading}</h1>
                  </div>
                  <div class="Polaris-Card__Section">
                    <p>${data.body}</p>
                  </div>
                  ${footerMarkup}
                </div>
              </div>
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">
                  <div class="Polaris-Stack__Item">
                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="AcceptCookies">
                      <span class="Polaris-Button__Content"><span>${
                        data.action
                      }</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <script>
  ${data.script}
  </script>
</body>
</html>`;
}
