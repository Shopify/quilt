// We need to specify the import/resolver setting in an extendable
// configuration so that we can put it before plugin:shopify/typescript,
// which puts the typescript resolver first, which resolves the modules to
// their source location and makes them look as if they are not external
// modules. This setting makes the node resolver be used first, which
// resolves to the (symlinked) code placed in node_modules.
module.exports = {
  settings: {
    'import/resolver': {
      node: {},
    },
  },
};
