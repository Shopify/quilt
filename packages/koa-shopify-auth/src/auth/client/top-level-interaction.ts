// Copied from https://github.com/Shopify/shopify_app
const topLevelInteraction = (shop: string) => {
  return `(function() {
      function setUpTopLevelInteraction() {
        var TopLevelInteraction = new ITPHelper({
          redirectUrl: "/auth?shop=${shop}",
        });

        TopLevelInteraction.execute();
      }

      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);
    })();`;
};

export default topLevelInteraction;
