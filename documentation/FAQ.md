# Frequently asked questions (FAQ)

## I want to invoke all my validators whenever I want, how can I do this?

You can do this by setting a `ref` on your `<FormState />`, and calling `validateForm` on the instance passed in.

```typescript
// use `createRef` and validate imperatively later
class MyComponent extends React.Component {
  formState = React.createRef();

  render() {
    return (
      <FormState
        initialValues={fields}
        ref={this.formState}
      />
      <button onClick={() => this.formState.current.validateForm()}>validate</button>
    );
  }
}
```

If you need to do something immediately on mount you could also use old fashioned [callback refs](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs).

## More questions

Have a question that you think should be included in our FAQ? Please help us by creating an [issue](https://github.com/Shopify/quilt/issues/new?template=ENHANCEMENT.md) or opening a pull request.
