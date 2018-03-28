# `@shopify/jest-dom-mocks`

Jest mocking utilities for working with the DOM.

## Installation

```bash
$ yarn add @shopify/jest-dom-mocks
```

## Setup

This package provides a method, `ensureMocksReset`, which should be called in the `beforeEach` method of the jest `each-test` setup file. For example:

```ts
import { ensureMocksReset } from "@shopify/jest-dom-mocks";

beforeEach(() => {
  ensureMocksReset();
});
```

this will ensure that appropriate error messages are shown if a DOM object is faked without beign restored for the next test.

## Example Usage

In this example, we are testing a `NumberTransitioner` component using `Jest` and `Enzyme`. Note that parts of this file have been omitted in order to focus in on the relevant parts of the example.

```ts
import { clock, animationFrame } from "@shopify/jest-dom-mocks";

it("transitions to the next number after being updated", () => {
  clock.fake();
  animationFrame.fake();

  const duration = 1000;
  const rendered = mount(
    <NumberTransitioner duration={duration}>{100}</NumberTransitioner>
  );
  rendered.setProps({ children: 200 });

  clock.tick(duration / 4);
  animationFrame.runFrame();
  expect(rendered.text()).toBe("125");

  clock.tick(duration / 2);
  animationFrame.runFrame();
  expect(rendered.text()).toBe("175");

  clock.restore();
  animationFrame.restore();
});
```

## API Reference

See the comments and TypeScript annotations in the code for details on the provided utilities.
