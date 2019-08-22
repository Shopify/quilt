# FAQ

## Another form library?

Good forms in React are surprisingly tough. A good API needs to support complex usecases with large numbers of fields split up across multiple components and explicit validation. It also needs to be quick to get started with and work for the simplest of forms cleanly. In meeting these goals, a package needs to balance developer experience, flexibility, and performance.

At Shopify we wanted our form solution to be true to the Web Foundations team's core values. We wanted it to be [explicit, type-safe](https://github.com/Shopify/web-foundation/blob/master/Principles/3%20-%20Explicit%20over%20automatic.md), and to [prioritize user experience](https://github.com/Shopify/web-foundation/blob/master/Principles/1%20-%20User%20over%20team%20over%20self.md) while keeping code quality and developer happiness high.

Several popular community packages sit at different places on the spectrum for these requirements, and all are solid choices for many projects. While we find it valuable to [use and contribute to community libraries,](https://github.com/Shopify/web-foundation/blob/master/Principles/5%20-%20Community%20over%20ownership.md) in this case we felt that we were better off going our own way.

- [formik](https://github.com/jaredpalmer/formik) offers a declarative way of managing form state with minimal dependencies. Unfortunately since it uses a single set of handlers across all a form's fields we found it insufficiently type safe.
- [redux-form](https://redux-form.com/7.4.2/) offers a redux integrated solution that can be quite magical and gives you the power of the redux dev tools for debugging broken states. Not all react apps need or want redux, and the library is fairly heavy, so we found it unsuitable for our uses.

As such the main difference in our solution is the explicit, declarative api. Form fields are given explicit handlers generated individually for each field and made available through a [render prop](https://reactjs.org/docs/render-props.html). To reduce boilerplate we've kept the generated `field` objects as easy to use as possible. Usually you can just splat them onto your inputs. We'll go into this in more detail in the [usage guide](https://github.com/Shopify/quilt/tree/master/packages/react-form-state/docs/building-forms.md). Creating handlers for each field instead of having one that you share or inject using a higher order component means we are fully type safe, with editor autocomplete able to show a developer exactly what fields are available, and compilation breaking when someone tries to use a field that doesn't exist.

`<FormState />` also differs in that it's validation behavior is based around the [Polaris form validation guidelines](https://polaris.shopify.com/patterns/error-messages#section-form-validation) out of the box. This allows us to provide consistent feedback across all pages that use it without developers having to think about it.

## I want to invoke all my validators whenever I want, how can I do this?

You can do this by setting a [`ref`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) on your `<FormState />`, and calling `validateForm` on the instance passed in.

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

## My form keeps resetting for no reason! / My form is resetting whenever I change an input!

By default `<FormState />` resets whenever any value in your `initialValues` changes. If you are basing your initial values on existing state, this lets it update when your state changes (usually this would be the result of submitting).

If this is happening on each rerender, it is likely that you are generating your `initialValues` in some way that is different each time. This can happen when you construct `Date` objects, `UUID`s, or other dynamic values inline. You can solve this by `memoize`ing your initial value creation or creating dates and other dynamic data only once outside of your component's `render` method.

```typescript
// Bad!
function MyForm() {
  return (
    <FormState
      initialValues={
        publicationDate: new Date(),
        text: '',
      }
    >
    {({fields}) => /* markup*/ }
    </FormState>
  );
}


// Good!
const today = new Date();

function MyForm() {
  return (
    <FormState
      initialValues={
        publicationDate: today,
        text: '',
      }
    >
    {({fields}) => /* markup*/ }
    </FormState>
  );
}
```

## Can I have more control over what happens when initialValues change?

You can control how `<FormState />` reacts to changes in the `initialValue` prop using `onInitialValueChanged`. This prop has three options:

- (default) `reset-all`: Reset the entire form when `initialValues` changes.
- `reset-where-changed`: Reset only the changed field objects when `initialValues` changes.
- `ignore`: Ignore changes to the `initialValues` prop. This option makes `<FormState />` behave like a [fully uncontrolled component](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key). You will generally want to accompany this option with a [`key`](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) or [`ref`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs).

## More questions

Have a question that you think should be included in our FAQ? Please help us by creating an [issue](https://github.com/Shopify/quilt/issues/new?template=ENHANCEMENT.md) or opening a pull request.
