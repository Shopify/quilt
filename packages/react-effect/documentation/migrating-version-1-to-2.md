# Migrating from `@shopify/react-effect@1.x` to `@shopify/react-effect@1.x`

## `<Effect />`

The `kind` prop on `<Effect />` has been updated to a description of the effect kind, not just a symbol. The simples change would be to update `kind` to accept an object with the ID matching your old symbol:

```tsx
const EFFECT_ID = Symbol();

// In 1.x
<Effect kind={EFFECT_ID} perform={someFunction} />

// In 2.x
<Effect kind={{id: EFFECT_ID}} perform={someFunction} />
```

You might want to also attach some cleanup logic to the effect kind that will be run either between two tree traversals, or after every tree traversal. For example, you might want the effect to come from a manager provided in context that cleans up after each traversal:

```tsx
// No real equivalent in 1.x...
class Manager {
  effect = {
    id: EFFECT_ID,
    betweenEachPass: () => this.reset(),
  };

  reset() {}
}

<Context.Provider value={new Manager()}>
  <Context.Consumer>
    {manager => (
      <Effect kind={manager.effect} perform={doSomethingWithManager(manager)} />
    )}
  </Context.Consumer>
</Context.Provider>;
```

## `extract()`

If you were passing an array of symbols to include for the extraction, this is now passed as an `include` option instead:

```tsx
// In 1.x
extract(<App />, [EFFECT_ID_ONE, EFFECT_ID_THREE]);

// In 2.x
extract(<App />, {
  include: [EFFECT_ID_ONE, EFFECT_ID_THREE],
});
```

If you are also using Apollo for GraphQL data, we recommend you use [`@shopify/react-effect-apollo`](../../react-effect-apollo), which can collapse the tree passes performed by Apollo and this library into a single set. Instructions for doing so are in the documentation for `@shopify/react-effect-apollo`.
