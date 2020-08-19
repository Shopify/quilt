# We use @shopify/react-testing for testing React codebases

## Date

(retroactive) April 1, 2020

## Contributors

- @themallen (Mathew Allen)

## Summary

We use and maintain [`@shopify/react-testing`](https://github.com/Shopify/quilt/blob/master/packages/react-testing/README.md) for testing React applications at Shopify. Usage of supplemental tools for visual regression testing and to aid in manual functional testing is also encouraged where needed.

## Problem space

There are a number of testing libraries available for React applications. The most popular of these focus on testing the behaviour of components in response to initial data and subsequent user interaction and the composition of components together. Testing of the actual visual output of a component is usually not included in the scope of these libraries, or is encouraged to be done via snapshots of the DOM (which is highly [problematic](https://github.com/Shopify/web-foundation/blob/main/handbook/Decision%20records/03%20-%20We%20do%20not%20use%20Jest%20snapshot%20tests.md)).

### Prior Art #1 - Enzyme

[Enzyme](https://enzymejs.github.io/enzyme/) is a very popular testing library that offers many features such as JQuery style traversal of the React component tree, shallow rendering, and a variety of tools for simulating interactions with an application.

Unfortunately, Enzyme has a number of downsides for our usecase.

- It has frequently taken a long time to support new React features (specifically, it took quite a while for it to properly support hooks)
- It has a very large API surface area, much of which works against Shopify’s [testing conventions](https://github.com/Shopify/web-foundation/blob/main/Best%20practices/react/Testing.md). For example, Enzyme provides APIs like `setState` which encourage reaching in to implementation details of your components
- Enzyme is unlikely to add features we use or need in a testing library, such as automatic unmounting and a built-in version `trigger()`
- Enzyme tends to continue to support a large backlog of React versions, which makes contribution more difficult

### Prior Art #2 - Testing-Library

[testing-library](https://testing-library.com/docs/react-testing-library/intro) is a more recently popular testing library with an ethos of testing by mimicking how a user would use the application by sticking close to the DOM.

While this premise of writing tests that mirror user actions is compelling, basing all tests off the raw DOM being produced has a number of problems.

- Relying exclusively on DOM output can actually lead to testing **more** implementation details rather than less. Users generally do not interact with things based on constructs like test-ids ([see our previous decision log about test-ids](https://github.com/Shopify/web-foundation/blob/main/handbook/Decision%20records/04%20-%20We%20do%20not%20use%20test%20IDs.md)), or even by actual HTML attributes. The DOM itself is not a public API from a user's perspective.
- Tests that rely on fine-grain knowledge of the DOM structure have a tendency to false-positive _and_ false-negative. It is extremely difficult to judge how a change in DOM structure which fails a test actually reflects a user's experience of the feature.
- Tests which ignore component boundaries can easily rely on the implementation details of components potentially maintained by totally different teams. A test of a feature should not necessarily care about the implementation details of a button from a shared component library, just that the component/feature under test does what is expected.
- For an ecosystem like React, the DOM is not the only intended output.

## Solution

We use and maintain [`@shopify/react-testing`](https://github.com/Shopify/quilt/blob/main/packages/react-testing/README.md) as our test library of choice for unit testing component behaviour and composition. We supplement this with [visual regression testing](https://percy.io/), manual functional testing, and usage of tools like [storybook](https://storybook.js.org/) to aid in UI development where needed.

`@shopify/react-testing` was originally built by @lemonmade as a direct response to some difficulties we were experiencing with Enzyme, and has since gone on to become the dominant way we test components and features in React applications at Shopify. Since then we have also released `@shopify/preact-testing` for our Preact applications. The library is closer to `Enzyme` than `testing-library` but has a number of significantly different choices which make it an ideal middleground:

- A small API focused on testing the API of components directly and avoiding options which break that such as `setState`
- A total avoidance of "shallow" rendering
- A streamlined method for interacting with components avoiding event simulation in favour of `trigger`ing callbacks directly
- Tight integration with React's `act` system for testing complex asynchronous user flows
- Tracking major versions of React and aggressive deprecation of support for old versions allowing it to be updated and maintained quickly
- Built-in facilities for customizing the `mount` function to reuse setup when testing complex applications
- Smart cleanup behaviour allowing test suites to scale without memory leakage
- Terse and literate custom matchers for the [`Jest`](https://www.npmjs.com/package/jest) test runner

These features add up to make the library a well-positioned solution for behavioural and compositional testing of individual components and large-grain feature flows. This variety of test can go very far in keeping developers shipping confidently, but in some cases may need to be supplemented via other tools. Dedicated [visual regression testing tools](https://percy.io/) and [UI component development tools](https://storybook.js.org/) can be helpful in this regard.
