# `@shopify/react-testing`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-testing.svg)](https://badge.fury.io/js/%40shopify%2Freact-testing.svg)

A library for testing React components according to [Shopify conventions](https://github.com/Shopify/web-foundation/blob/master/Best%20practices/React/Testing.md).

## Table of contents

1. [Installation](#installation)
1. [Usage](#usage)
   1. [`Root`](#root)
   1. [`Element`](#element)
   1. [`mount()`](#mount)
   1. [`createMount()`](#createMount)
   1. [`destroyAll()`](#destroyAll)
1. [Matchers](#matchers)
1. [FAQ](#faq)

## Installation

```bash
$ yarn add @shopify/react-testing
```

## Usage

This library allows you to test React components with a focus on type safety and testing based on a component’s external API. In order to keep the API small and easy-to-use, it will generally track to only the latest minor release of React.

### <a name="root"></a> `Root<Props>`

A `Root` object represents a mounted React tree. Most of the properties and methods it exposes are simply forwarded to the [`Element`](#element) instance representing the top-level component you rendered:

- [#children](#children)
- [#descendants](#descendants)
- [#props](#props)
- [#isDOM](#isDOM)
- [#instance](#instance)
- [#domNode](#domNode)
- [#domNodes](#domNodes)
- [#html()](#html)
- [#text()](#text)
- [#is()](#is)
- [#prop()](#prop)
- [#find()](#find)
- [#findAll()](#findAll)
- [#findWhere()](#findWhere)
- [#findAllWhere()](#findAllWhere)
- [#trigger()](#trigger)
- [#triggerKeypath()](#triggerKeypath)

This object also has a number of methods that only apply to the root of a component tree:

#### <a name="root-mount"></a> `mount()`

Re-mounts the component to the DOM. If the component is already mounted, this method will throw an error.

#### <a name="unmount"></a> `unmount()`

Unmounts the component from the DOM. If the component is not already mounted, this method will throw an error. This method can be useful for testing side effects that occur in `componentWillUnmount` or `useEffect` hooks.

#### <a name="setProps"></a> `setProps(props: Partial<Props>)`

Allows you to change a subset of the props specified when the component was originally mounted. This can be useful to test behaviour that is only caused by a change in props, such as `getDerivedStateFromProps` or its equivalent `useRef`/ `useState` hook version.

#### <a name="act"></a> `act<T>(action: () => T): T`

Performs an action in the context of a React [`act() block`](https://reactjs.org/docs/test-utils.html#act), then updates the internal representation of the React tree. You **must** use this whenever performing an action that will cause the React tree to set state and re-render, such as simulating event listeners being called. Failing to do so will print a warning, and the React tree will not be updated for subsequent calls to methods such as `find()`.

```tsx
function MyComponent() {
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(
    () => {
      const handler = () => setClicked(true);
      document.body.addEventListener('click', handler);
      return () => document.body.removeEventListener('click', handler);
    },
    [setClicked],
  );

  return clicked ? <div>I’ve been clicked!</div> : <div>Nothing yet</div>;
}

const myComponent = mount(<MyComponent />);

// If you don’t do this, you’ll see a warning and the subsequent assertion
// will fail
myComponent.act(() => simulateClickOnBody());

expect(myComponent.text()).toContain('I’ve been clicked!');
```

#### <a name="destroy"></a> `destroy()`

Unmounts the component and removes its associated DOM node. This method ensures that nothing leaks between tests. It is called on all un-destroyed `Root` objects when you call [`destroyAll()`](#destroyAll)

#### <a name="forceUpdate"></a> `forceUpdate()`

Forces the root component to re-render. This can be necessary in some cases where globals change in a way that does not already cause a "natural" React update, but in general, this method should not be necessary.

### <a name="element"></a> `Element<Props>`

The `Element` object represents a React element in the tree. This element can be a DOM node, custom React component, or one of the many "special" types React creates, such as context providers and consumers. The `Element` object also houses all of the methods that you will use to find rendered subcomponents ([`find`](#find) and friends), get your React tree into the desired state ([`trigger`](#trigger)), and ensure that state is correct ([`props`](#props)).

It is important to understand that the `Element` object is only a snapshot representation of the React tree at one point in time. As soon as you use `trigger` to simulate calling a prop, or [`Root#act`](#act) to commit an arbitrary update, the `Element` should be considered "stale" and discarded.

#### <a name="props"></a> `props: Props`

This getter returns the props for the component.

#### <a name="type"></a> `type: any`

This getter returns the type of component. For DOM nodes, this will be a string representing the rendered DOM element. For custom React components, this will be the React component itself. For all other elements, this will be `null`.

#### <a name="isDOM"></a> `isDOM: boolean`

This getter returns whether the element represents a DOM node.

#### <a name="instance"></a> `instance: any`

This getter returns the instance associated with the component. **Note:** this property technically gives you access to fields like `state` and methods like `setState`, but doing so violates component boundaries and makes for bad tests. If you can avoid it, you should never use this getter. It should be seen only as an escape hatch when it is impossible to perform the update you need with props alone.

#### <a name="children"></a> `children: Element<unknown>[]`

This getter returns an array of elements that represent the element children of this component in the React tree.

#### <a name="descendants"></a> `descendants: Element<unknown>[]`

This getter returns an array of elements that represent all elements below this component in the React tree.

#### <a name="domNodes"></a> `domNodes: HTMLElement[]`

Returns all DOM nodes that are directly rendered by this component (that is, not rendered by descendant components).

#### <a name="domNode"></a> `domNode: HTMLElement | null`

Like `domNodes`, but expects only 1 or 0 DOM nodes to be direct children. If more than 1 DOM node is a child, this method throws an error. If no DOM nodes are children, this method returns `null`.

#### <a name="prop"></a> `prop<K extends keyof Props>(key: K): Props[K]`

Returns the current value of the passed prop.

```tsx
function MyComponent({name}: {name: string}) {
  return <div>Hello, {name}!</div>;
}

function Wrapper() {
  return <MyComponent name="Michelle" />;
}

const wrapper = mount(<Wrapper />);
expect(wrapper.find(MyComponent).prop('name')).toBe('Michelle');

// Will give you a type error
expect(wrapper.find(MyComponent).prop('firstName')).toBe('Uhh');
```

#### <a name="text"></a> `text(): string`

Returns the text content of the component. This is the string of text you would receive from mapping over each DOM node rendered as a descendant of this component and taking its `textContent`.

#### <a name="html"></a> `html(): string`

Returns the HTML content of the component. This is the string of text you would receive from mapping over each DOM node rendered as a descendant of this component and taking its `innerHTML`.

#### <a name="is"></a> `is(type: Type): this is Element<PropsForComponent<Type>>`

Returns a boolean indicating whether the component type matches the passed type. This function also serves as a type guard, so subsequent calls to values like `props` will be typed as the prop type of the passed component.

```tsx
function MyComponent({name}: {name: string}) {
  return <div>Hello, {name}!</div>;
}

function isMatch(element: Element<unknown>) {
  // If we omitted element.is here, we would not know whether 'name' was a prop,
  // so we would get a type error.
  return element.is(MyComponent) && element.prop('name') === 'Chris';
}
```

#### <a name="find"></a> `find(type: Type, props?: Partial<PropsForComponent<Type>>): Element<PropsForComponent<Type>> | null`

Finds a descendant component that matches `type`, where `type` is either a string or React component. If no matching element is found, `null` is returned. If a match is found, the returned `Element` will have the correct prop typing, which provides excellent type safety while navigating the React tree.

```tsx
function MyComponent({name}: {name: string}) {
  return <div>Hello, {name}!</div>;
}

function YourComponent() {
  return <div>Goodbye, friend!</div>;
}

function Wrapper() {
  return <MyComponent name="Michelle" />;
}

const wrapper = mount(<Wrapper />);
expect(wrapper.find(MyComponent)).not.toBeNull();
expect(wrapper.find(YourComponent)).toBe(null);
```

You can optionally pass a second argument to this function, which is a set of props that will be used to further filter the matching elements. These props will be shallow compared to the props of each element.

```tsx
function MyComponent({name}: {name: string}) {
  return <div>Hello, {name}!</div>;
}

function YourComponent() {
  return <div>Goodbye, friend!</div>;
}

function Wrapper() {
  return (
    <>
      <MyComponent name="Michelle" />
      <MyComponent name="Gord" />
    </>
  );
}

const wrapper = mount(<Wrapper />);
expect(wrapper.find(MyComponent, {name: 'Gord'})!.props).toMatchObject({
  name: 'Gord',
});
```

#### <a name="findAll"></a> `findAll(type: Type, props?: Partial<PropsForComponent<Type>>): Element<PropsForComponent<Type>>[]`

Like `find()`, but returns all matches as an array.

#### <a name="findWhere"></a> `findWhere(predicate: (element: Element<unknown>) => boolean): Element<unknown> | null`

Finds the first descendant component matching the passed function. The function is called with each `Element` from [`descendants`](#descendants) until a match is found. If no match is found, `null` is returned.

#### <a name="findAllWhere"></a> `findAllWhere(predicate: (element: Element<unknown>) => boolean): Element<unknown>[]`

Like `findWhere`, but returns all matches as an array.

#### <a name="trigger"></a> `trigger<K extends FunctionKeys<Props>>(prop: K, ...args: Arguments<Props<K>>): ReturnType<Props<K>>`

Simulates a function prop being called on your component. This is usually the key to effective tests: after you have mounted your component, you simulate a change in a subcomponent, and assert that the resulting React tree is in the expected shape. This method automatically uses [`Root#act`](#act) when calling the prop, so updates will automatically be applied to the root component.

When you pass a key that is a prop on your component with a function type, this function will ensure that you pass arguments that are deeply partial versions of the types the prop expects. This allows you to, for example, pass an event object with only a few properties set to a `button`’s `onClick` prop. `trigger` returns whatever the result was of calling the prop.

```tsx
function MyComponent({onClick}: {onClick(id: string): void}) {
  return (
    <button type="button" onClick={() => onClick(String(Math.random()))}>
      Click me!
    </button>
  );
}

function Wrapper() {
  const [id, setId] = React.useState<string>('');

  return (
    <>
      <MyComponent onClick={setId} />
      <div>Current id is: {id}</div>
    </>
  );
}

const wrapper = mount(<Wrapper />);
wrapper.find(MyComponent)!.trigger('onClick', 'some-id');
expect(wrapper.find('div')!.text()).toContain('some-id');
```

#### <a name="triggerKeypath"></a> `triggerKeypath<T>(keypath: string, ...args: any[]): T`

Like `trigger()`, but allows you to provide a keypath referencing nested objects instead. Note that limitations in TypeScript prevent the same kind of type-safety as `trigger` guarantees.

```tsx
function MyComponent({action}: {action: {onAction(): void; label: string}}) {
  return (
    <button type="button" onClick={action.onAction}>
      {action.label}
    </button>
  );
}

const spy = jest.fn();
const myComponent = mount(
  <MyComponent action={{label: 'Hi', onAction: spy}} />,
);
myComponent.triggerKeypath('action.onAction');
expect(spy).toHaveBeenCalled();
```

### <a name="mount"></a> `mount(element: React.ReactElement<any>)`

Mounts a component to the DOM and returns a [`Root`](#root) instance. Note that in order for this to work, you must have a simulated browser environment, such as the `jsdom` environment that Jest uses.

### <a name="createMount"></a> `createMount<MountOptions, Context, Async>(options: CreateMountOptions<MountOptions, Context, Async>): MountFunction`

The [`mount`](#mount) function is powerful on its own, but applications will often want a more powerful version tailored to their application. A common example is app-wide context, where a set of context providers are generally assumed to be present for every component under test. It can also be useful for providing custom GraphQL infrastructure that enables easy testing of different API responses, such as the [`createGraphQL` factory from `@shopify/graphql-testing`](../graphql-testing).

`createMount` enables this kind of customization by vending a custom `mount` function that will automatically wrap the component under test in an appropriate test wrapper. This custom mount function can do four things:

- Allow custom options be passed as the second argument to mount, as specified by the `MountOptions` generic
- Map passed options to an object containing all the relevant "context" (be it objects passed through React context providers, or other useful values for controlling the test harness)
- Use the resolved context to render React components around the element under test that use the context
- Perform some additional resolution after the component has mounted, including asynchronous behavior like resolving initial API results

These features are controlled by the generic type arguments to `createMount`, and the options detailed in the section below. Note that, no matter how many context providers or test wrapper you end up rendering your element within, all of the methods on the returned [`Root`](#root) instance will still be scoped to within the tree actually under test.

#### `context(options: MountOptions): Context`

Takes an object of options passed by a user of your custom mount (or an empty object), and should return an object containing the context you need for the test harness. If your `Context` type has non-optional keys, you **must** provide this option.

#### `render(element: ReactElement, context: Context, options: MountOptions): ReactElement`

This function is called with the React element under test, the context created by `context()` (or an empty object), and the options passed by the user of your custom mount (or an empty object). This function must return a new React element, usually by wrapping the component in context providers.

#### `afterMount(root: CustomRoot, options: MountOptions): Promise | void`

This function allows you to perform additional logic after a component has been mounted. It gets called with a special [`Root`](#root) instance that has one additional property: `context`, the object with the context you created in `context()` (or an empty object). You can use this hook to perform some additional resolution after the component has mounted, such as resolving all GraphQL.

If this option returns a `Promise`, the result of calling `mount()` will become a promise that resolves to the custom `Root` instance. Otherwise, it will synchronously return the `Root` instance. If you specify the `Async` generic argument as `true`, you **must** pass this option.

#### Complete example

We usually want to create a mocked version of the GraphQL infrastructure for our app to prevent relying on real API calls. We provide the [`@shopify/graphql-testing` library](../graphql-testing) to create a mock GraphQL source and Apollo client that uses it.

In our example mount, we want people to be able to pass a custom GraphQL instance. We want the initial GraphQL results to resolve, unless the user of mount specifies that GraphQL should _not_ resolve until done manually. Finally, we want to expose this GraphQL instance on the returned wrapper for use to drive test results.

The custom mount for this situation would be built as demonstrated below.

```tsx
import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import createGraphQLFactory, {GraphQL} from '@shopify/graphql-testing';
import {createMount} from '@shopify/react-testing';
import {promise} from '@shopify/jest-dom-mocks';

// See graphql-testing docs for details
const createGraphQL = createGraphQLFactory();

// Here, we define the options a user can pass to mount. We need them to be able
// to pass two things: an optional GraphQL instance to drive the test, and an
// optional flag to skip initial GraphQL resolution.
interface Options {
  graphQL?: GraphQL;
  skipInitialGraphQL?: boolean;
}

// Next is the context. We only want to expose one thing as "context": The GraphQL
// instance driving the test.
interface Context {
  graphQL: GraphQL;
}

// Now, we can create our custom mount function! Unfortunately, due to limitations in
// TypeScript, you usually need to pass all the generic arguments, including the last
// one, which specifies whether your `afterMount` is async or not.
export const mountWithGraphQL = createMount<Options, Context, true>({
  // Step one: convert Options to Context
  context({graphQL = createGraphQL()}) {
    return {graphQL};
  },
  // Step two: use Context and Options to render the element under the test
  // with the necessary providers
  render(element, {graphQL}) {
    return <ApolloProvider client={graphQL.client}>{element}</ApolloProvider>;
  },
  // Final step: if we need post-mount behavior, inject it in. If it returns
  // a promise, like it does here, the final mount function will be async too.
  async afterMount(root, {skipInitialGraphQL}) {
    // This is a temporary hack to make GraphQL resolution behave pseudo-synchronously
    // to avoid warnings about setting state outside of act() blocks.
    root.context.graphQL.on('pre-resolve', () => {
      if (promise.isMocked()) {
        root.act(() => promise.runPending());
      }
    });

    if (skipInitialGraphQL) {
      return;
    }

    // Here's the important bit: resolve the GraphQL so our first queries are
    // in use for the component under test
    await root.context.graphQL.resolveAll();
  },
});
```

### <a name="destroyAll"></a> `destroyAll()`

All mounted components are tracked in-memory. `destroyAll()` forcibly unmounts all mounted components and removes the DOM node used to house them. You should run this after each test that mounts a component (this is often done in a global `afterEach` hook).

## Matchers

This library ships with a few useful custom matchers for Jest. To include these matchers, import `@shopify/react-testing/matchers` in any file that is included as part of the `setupFilesAfterEnv` option passed to Jest. The following matchers are available:

### `.toHaveReactProps(props: object)`

Checks whether a `Root` or `Element` object has specified props (asymmetric matchers like `expect.objectContaining` are fully supported). Strict type checking is enforced, so the `props` you pass must be a valid subset of the actual props for the component.

```tsx
const myComponent = mount(<MyComponent />);

expect(myComponent.find('div')).toHaveReactProps({'aria-label': 'Hello world'});
expect(myComponent.find('div')).toHaveReactProps({
  onClick: expect.any(Function),
});
```

### `.toHaveReactDataProps(data: object)`

Like `.toHaveReactProps()`, but is not strictly typed. This makes it more suitable for asserting on `data-` attributes, which can’t be strongly typed.

```tsx
const myComponent = mount(<MyComponent />);

expect(myComponent.find('div')).toHaveReactDataProps({
  'data-message': 'Hello world',
});
```

### `.toContainReactComponent(type: string | React.ComponentType, props?: object)`

Asserts that at least one component matching `type` is in the descendants of the passed node. If the second argument is passed, this expectation will further filter the matches by components whose props are equal to the passed object (again, asymmetric matchers are fully supported).

```tsx
const myComponent = mount(<MyComponent />);

expect(myComponent).toContainReactComponent('div', {
  'aria-label': 'Hello world',
  onClick: expect.any(Function),
});
```

### `.toContainReactText(text: string)`

Asserts that the rendered output of the component contains the passed string as text content (that is, the text is included in what you would get by calling `textContent` on all root DOM nodes rendered by the component).

```tsx
const myComponent = mount(<MyComponent />);
expect(myComponent).toContainReactText('Hello world!');
```

### `.toContainReactHtml(text: string)`

Asserts that the rendered output of the component contains the passed string as HTML (that is, the text is included in what you would get by calling `outerHTML` on all root DOM nodes rendered by the component).

```tsx
const myComponent = mount(<MyComponent />);
expect(myComponent).toContainReactText('<span>Hello world!</span>');
```

## FAQ

### Why not use [Enzyme](https://airbnb.io/enzyme/) instead?

Enzyme is a very popular testing library that heavily inspired the approach this library takes. However, our experience with Enzyme has not been ideal:

- It has frequently taken a long time to support new React features.
- It has a very large API surface area, much of which does not conform to Shopify’s [testing conventions](https://github.com/Shopify/web-foundation/blob/master/Best%20practices/React/Testing.md). For example, Enzyme provides APIs like `setState` which encourage reaching in to implementation details of your components.
- Enzyme is unlikely to add features we use or need in a testing library, such as automatic unmounting and a built-in version `trigger()`.

### Why not use [react-testing-library](https://github.com/kentcdodds/react-testing-library) instead?

While the premise of writing tests that mirror user actions is compelling, basing all tests off the raw DOM being produced becomes unmanageable for larger apps.
