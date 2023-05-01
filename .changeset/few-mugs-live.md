---
'@shopify/jest-dom-mocks': major
---

Replace `lolex` with using Jest's built-in clock mocking, available since Jest 26. Internally Jest uses `@sinon/fake-timers` which is the API-compatible successor to `lolex`.

As of Jest 26, the functionality of the Clock and Timer mocks are built into Jest. We recommend replacing usage of these mocks with calling jest directly:

- Replace `clock.mock()` and `timer.mock()` with `jest.useFakeTimers()`
- Replace `clock.restore()` and `timer.restore()` with `jest.useRealTimers()`
- Replace `clock.tick(time)` with `jest.advanceTimersByTime(time)`
- Replace `clock.setTime(time)` with `jest.setSystemTime(time)`
- Replace `timer.runAllTimers()` with `jest.runAllTimers()`
- Replace `timer.runTimersToTime()` with `jest.advanceTimersByTime()`

You may encounter problems if you try to use the Clock and Timer mocks in the same file. We suggest migrating away from both of them, and replacing them with Jest's own mocking behaviour.
