# Migration guide: `graphql-fixtures` <0.6.0 to 0.6.0

In version 0.6.0 of `graphql-fixtures`, the return value of `createFiller` was changed. Before, this returned a function that took a GraphQL document and (optional) partial data to use to fill the result, and returned a "filled in" object. In version 0.6.0, `createFiller` now returns a function that takes the same arguments, but returns a function that must be called with a `GraphQLRequest` object before being filled.

While this is a breaking change, most uses of `createFiller` will likely be unaffected. If you were using `fillGraphQL` in Shopify Web, or in a project that uses [`@shopify/graphql-testing`](https://github.com/Shopify/quilt/tree/master/packages/graphql-testing), the new shape of the return result still satisfies the expected return types.

However, if you were using `fillGraphQL` and expected to receive the data, this will no longer be the case. Such code would often look like this:

```ts
const fillGraphQL = createFiller(/* options */);
const data = fillGraphQL(myQuery);
const graphQL = createGraphQL({MyQuery: data});

/* ... */

expect(something).toBe(data.someDataOnTheQuery);
```

You have two options to update code like what is shown above:

**Option 1**: don’t reference data off the filled object, put the data you care about in scope instead. This is in keeping with our [recommendations on GraphQL testing](https://github.com/Shopify/web-foundation/blob/master/Best%20practices/GraphQL/Testing.md#mock-data), because it makes it clear what data you are providing explicit values for and prevents unnecessary type checking to access deeply nested properties.

```ts
const fillGraphQL = createFiller(/* options */);
const someDataOnTheQuery = 'foo';
const fillMyQuery = fillGraphQL(myQuery, {someDataOnTheQuery});
const graphQL = createGraphQL({MyQuery: fillMyQuery});

/* ... */

expect(something).toBe(someDataOnTheQuery);
```

**Option 2**: invoke the returned function immediately. This method will not work if you depend on some intermediate processing steps for the operation (for example, Apollo adding `__typename` fields), but does give you immediate access to a filled out result.

```ts
const fillGraphQL = createFiller(/* options */);
const fillMyQuery = fillGraphQL(myQuery);
const data = fillMyQuery({query: myQuery});
const graphQL = createGraphQL({MyQuery: data});

/* ... */

expect(something).toBe(data.someDataOnTheQuery);
```
