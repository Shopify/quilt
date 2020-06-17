      plugins.sass({
        autoInclude: [
          // Polaris sass helpers - optional
          // Only needed if the mixins provided are used in your app's sass files
          join(
            __dirname,
            '../node_modules/@shopify/polaris/esnext/styles/_public-api.scss'
          )
        ]
      }),
