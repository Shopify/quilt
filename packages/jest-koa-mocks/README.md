# `@shopify/jest-koa-mocks`

## Installation

```bash
$ yarn add @shopify/jest-koa-mocks
```

## Usage

### createContext

This function allows you to create fully stubbable koa contexts for your tests. Using this you can test middleware without actually having to setup an app or http mocks in your tests.

```typescript
  interface Options extends Dictionary<any> {
    url?: string;
    method?: RequestMethod;
    statusCode?: number;
    session?: Dictionary<any>;
    headers?: Dictionary<string>;
    [key: string]: any;
  }

  createContext(options: Options)
```

**simple example**

```typescript
import SillyViewCounterMiddleware from "../silly-view-counter";
import { createContext } from "jest-mock-koa";

describe("silly-view-counter", () => {
  it("iterates and displays new ctx.state.views", async () => {
    const ctx = createContext({ state: { views: 31 } });

    await SillyViewCounterMiddleware(ctx);

    expect(ctx.state.views).toBe(32);
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe({ view: 32 });
  });
});
```
