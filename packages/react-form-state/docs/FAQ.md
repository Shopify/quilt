# FAQ

## Another form library?

Good forms in React are surprisingly tough. A good API needs to support complex usecases with large numbers of fields split up across multiple components and explicit validation. It also needs to be quick to get started with and work for the simplest of forms cleanly. In meeting these goals, a package needs to balance developer experience, flexibility, and performance.

At Shopify we wanted our form solution to be true to the Web Foundations team's core values. We wanted it to be [explicit, type-safe](https://github.com/Shopify/web-foundation/blob/master/Principles/3%20-%20Explicit%20over%20automatic.md), and to [prioritize user experience](https://github.com/Shopify/web-foundation/blob/master/Principles/1%20-%20User%20over%20team%20over%20self.md) while keeping code quality and developer happiness high.

Several popular community packages sit at different places on the spectrum for these requirements, and all are solid choices for many projects. While we find it valuable to [use and contribute to community libraries,](https://github.com/Shopify/web-foundation/blob/master/Principles/5%20-%20Community%20over%20ownership.md) in this case we felt that we were better off going our own way.

- [formik](https://github.com/jaredpalmer/formik) offers a declarative way of managing form state with minimal dependencies. Unfortunately since it uses a single set of handlers across all a form's fields we found it insufficiently type safe.
- [redux-form](https://redux-form.com/7.4.2/) offers a redux integrated solution that can be quite magical and gives you the power of the redux dev tools for debugging broken states. Not all react apps need or want redux, and the library is fairly heavy, so we found it unsuitable for our uses.

As such the main difference in our solution is the explicit, declarative api. Form fields are given explicit handlers generated individually for each field and made available through a [render prop](https://reactjs.org/docs/render-props.html). To reduce boilerplate we've kept the generated `field` objects as easy to use as possible. Usually you can just splat them onto your inputs. We'll go into this in more detail in the [usage guide](/usage-guide.md). Creating handlers for each field instead of having one that you share or inject using a higher order component means we are fully type safe, with editor autocomplete able to show a developer exactly what fields are available, and compilation breaking when someone tries to use a field that doesn't exist.

`<FormState />` also differs in that it's validation behavior is based around the [Polaris form validation guidelines](https://polaris.shopify.com/patterns/error-messages#section-form-validation) out of the box. This allows us to provide consistent feedback across all pages that use it without developers having to think about it.
