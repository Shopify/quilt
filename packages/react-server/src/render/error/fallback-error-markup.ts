export const fallbackErrorMarkup = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/@shopify/polaris@4.24.0/styles.min.css"
    />
    <title>Server Error</title>
  </head>
  <body>
    <div
      style="
        --top-bar-background: #00848e;
        --top-bar-background-lighter: #1d9ba4;
        --top-bar-color: #f9fafb;
        --p-frame-offset: 0px;
      "
    >
      <div class="Polaris-Page Polaris-Page--fullWidth">
        <div class="Polaris-Page__Content">
          <div
            style="
              --top-bar-background: #00848e;
              --top-bar-background-lighter: #1d9ba4;
              --top-bar-color: #f9fafb;
              --p-frame-offset: 0px;
            "
          >
            <div class="Polaris-EmptyState Polaris-EmptyState--withinPage">
              <div class="Polaris-EmptyState__Section">
                <div class="Polaris-EmptyState__DetailsContainer">
                  <div class="Polaris-EmptyState__Details">
                    <div class="Polaris-TextContainer">
                      <p
                        class="Polaris-DisplayText Polaris-DisplayText--sizeMedium"
                      >
                      This page is not available right now
                      </p>
                      <div class="Polaris-EmptyState__Content">
                        <p>
                          Please check back later.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="Polaris-EmptyState__ImageContainer">
                  <img
                    src="https://cdn.shopify.com/shopifycloud/web-foundation/images/error.svg"
                    role="presentation"
                    alt=""
                    class="Polaris-EmptyState__Image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
