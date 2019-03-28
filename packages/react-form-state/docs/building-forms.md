# Building forms with FormState

## Basic

When using `<FormState>`, you express your form's component tree as a function of the generated field state objects provided by `<FormState />` into its `children` function as `formDetails`.

```typescript
interface FormDetails<Fields> {
  fields: FieldDescriptors<Fields>;
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
  errors: RemoteError[];
  reset(): void;
  submit(): void;
}
```

The `formDetails` object passed into `children` contains a `fields` dictionary, which includes all the state and handlers you need to render your form.

```typescript
interface FieldState<Value> {
  name: string;
  initialValue: Value;
  value: Value;
  dirty: boolean;
  error?: any;
  onBlur(): void;
}
```

The simplest way to use `<FormState />` is to pass it some `initialValues` and render some `input`s in its `children` render prop.

```typescript
import FormState from '@shopify/react-form-state';

function MyComponent() {
  return (
    <FormState
      initialValues={{
        title: 'Cool title',
        description: 'Cool product',
      }}
    >
      {formDetails => {
        const {fields} = formDetails;
        const {title, description} = fields;

        return (
          <form>
            <label htmlFor={title.name}>Title</label>
            <input
              {...title}
              id={title.name}
              onChange={({currentTarget}) => {
                // our onChange expects just a value, no event needed
                title.onChange(currentTarget.value);
              }}
            />

            <label htmlFor={description.name}>Title</label>
            <input
              {...description}
              id={title.name}
              onChange={({currentTarget}) => {
                description.onChange(currentTarget.value);
              }}
            />
          </form>
        );
      }}
    </FormState>
  );
}
```

## Reducing boilerplate with custom inputs

The previous example has a fair amount of repetition around passing the right handlers to the right inputs. It also doesn't handle rendering errors. We can eliminate this boilerplate by using a custom component with props which match our field descriptor objects.

[@shopify/polaris](https://polaris.shopify.com/components/forms/text-field)'s `<TextField />` component expects props that match our API. So, using `<TextField />` and ES6 [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax we can greatly simplify our forms. The Polaris inputs also support `error` props, allowing us to surface error messages to our users at the field level once we set up validation.

```typescript
import {TextField} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

function MyComponent() {
  return (
    <FormState
      initialValues={{
        title: 'Cool title',
        description: 'Cool product',
      }}
    >
      {formDetails => {
        const {fields} = formDetails;

        return (
          <form>
            <TextField label="Title" {...fields.title} />
            <TextField label="Description" {...fields.description} />
          </form>
        );
      }}
    </FormState>
  );
}
```

There is also nothing to stop you from using your own custom inputs.

## Submission

Forms usually need some mechanism of submission. `<FormState />` is not opinionated about how this is done, but does provide a built-in mechanism for managing loading state and updating based on errors from the submission process. Most of this is done through the `onSubmit` property.

```typescript
  onSubmit={async ({fields}: FormData<Fields>) => {
    const result = await updateProduct(fields);

    if (isErrorResult(result)) {
      return result.errors;
    }
  }}
```

When given an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function (or one that returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), the `children` function will be rerendered with `submitting: true` until the promise resolves or rejects. Once it has returned the function will be re-rendered with `submitting: false` and `errors` either `[]` (if the promise resolved with no value), or with an array of `{field?: string | string[], error: string}` if the promise resolved with an error list. Any errors with a `field` value will also be propagated down to matching fields.

```typescript
// api.ts

const fakeErrorResult = {error: [{message: 'api is not real'}]};

// simple async function that fakes a failing api call
export function fakeApiCall(data: any) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fakeErrorResult);
    }, 2000);
  });
}
```

```typescript
// MyPage.ts
import {fakeApiCall} from './api';
import {TextField, Button, Banner, FormLayout, Spinner} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

export function MyPage() {
  return (
    <FormState
      initialValues={{email: '', password: ''}}
      onSubmit={async () => {
        const results = await fakeApiCall();
        if (results.error) {
          return results.error;
        }
      }}
    >
      {({fields, submitting, errors, submit, valid}) => {
        return (
          <form onSubmit={submit}>
            {submitting && <Spinner size="large" color="teal" />}

            {!valid && (
              <Banner status="critical">
                <ul>
                  {errors.map(error => (
                    <li key={`${error.message}${error.field}`}>
                      {error.message}
                    </li>
                  ))}
                </ul>
              </Banner>
            )}

            <FormLayout>
              <TextField label="Email" {...fields.email} />
              <TextField label="Password" {...fields.password} />
            </FormLayout>

            <Button primary type="submit" disabled={submitting}>
              Save
            </Button>
          </form>
        );
      }}
    </FormState>
  );
}
```

## Resetting

Most forms need to expose a way to reset all fields to their initial values. The `reset()` function passed into `children()` allows you to easily make this available to a user.

```typescript
// MyPage.ts
import {TextField, Button} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

export function MyPage() {
  return (
    <FormState
      initialValues={{email: '', password: ''}}
    >
      {({fields, reset, dirty}) => {
        return (
          <form>
            <FormLayout>
              <TextField label="Email" {...fields.email} />
              <TextField label="Password" {...fields.password} />
            </FormLayout>

            <Button
              onClick={reset}
              disabled={!dirty}
            >
              Reset
            </Button>
          </form>
        );
      }}
    </FormState>
  );
```

## Dirty Tracking

Often you want to change some UI behavior based on whether a form has changed from its initial values. `<FormState />` supports this both on the form and individual field level.

```typescript
// MyPage.ts
import {TextField, Button} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

export function MyPage() {
  return (
    <FormState
      initialValues={{email: '', password: ''}}
    >
      {({fields, dirty}) => {
        const dirtyMarkup = fields.password.dirty && (
          <p>you have edited this</p>
        );

        return (
          <form>
            <FormLayout>
              <TextField label="Email" {...fields.email} />
              <TextField label="Password" {...fields.password} />
              {dirtyMarkup}
            </FormLayout>

            <Button
              primary
              type="submit"
              disabled={!dirty}
            >
              Save
            </Button>
          </form>
        );
      }}
    </FormState>
  );
```

# Validation

`<FormState />` supports client-side validation through the `validators` prop.

```typescript
export type ValidatorDictionary<Fields> = {
  [FieldPath in keyof Fields]: MaybeArray<
    ValidationFunction<Fields[FieldPath], Fields>
  >
};

interface ValidationFunction<Value, Fields> {
  (value: Value, fields: FieldStates<Fields>): any;
}
```

To define validators use the `validators` prop and pass it a partial dictionary of validation functions.

```typescript
  validators={{
    title(input) {
      if (input === 'foo') {
        return 'title cannot be foo';
      }
    },
  }}
```

To run multiple functions on the same field you can also use an array of functions.

```typescript
  validators={{
    password: [
      (input) => {
        if (input.length > 20) {
          return 'too big';
        }
      },
      (input) => {
        if (input.length < 3) {
          return 'too small';
        }
      },
  ]}}
```

`<FormState />` generates handlers that follow the [Polaris form validation guidelines](https://polaris.shopify.com/patterns/error-messages#section-form-validation). When you blur an input, or when you change it and it already has an error, any defined validators for that field will be invoked.

```typescript
import {TextField} from '@shopify/polaris';
import FormState, {validators} from '@shopify/react-form-state';

function MyComponent() {
  return (
    <FormState
      initialValues={{
        title: 'Cool title',
        description: 'Cool product',
        quantity: 0,
      }}
      validators={{
        title(input) {
          if (input.length > 10) {
            return 'That title is too long';
          }
        },
        quantity() {
          if (!/[^0-9.,]/g.test(input)) {
            return 'Quantity must be a number';
          }
        },
      }}
    >
      {formDetails => {
        const {fields} = formDetails;

        return (
          <form>
            <TextField label="Title" {...fields.title} />
            <TextField label="Description" {...fields.description} />
            <TextField label="Quantity" {...fields.quantity} />
          </form>
        );
      }}
    </FormState>
  );
}
```

### validateOnSubmit

You can configure `<FormState />` to run all validators on the form before executing `onSubmit` by passing it the `validateOnSubmit` prop. If any of the validators return an error, the submit is cancelled and `onSubmit` is not run. Any errors discovered will be available on the `errors` object.

```typescript
import {Banner, Button, ExceptionList, Form, TextField} from '@shopify/polaris';
import FormState, {validators} from '@shopify/react-form-state';

function MyComponent() {
  return (
    <FormState
      validateOnSubmit
      initialValues={{
        title: 'Cool title',
      }}
      validators={{
        title(input) {
          if (input.length > 10) {
            return 'That title is too long';
          }
        },
      }}
      onSubmit={() => {
        console.log('I will not be run if title is too long');
      }}
    >
      {formDetails => {
        const {errors, fields, submit} = formDetails;

        const errorBanner = Boolean(errors.length) && (
          <Banner status="critical" title={`${errors.length} Errors`}>
            <ExceptionList
              items={errors.map(({message: description}) => ({description}))}
            />
          </Banner>
        );

        return (
          <>
            {errorBanner}
            <Form onSubmit={submit}>
              <TextField label="Title" {...fields.title} />
              <Button type="submit">Submit</Button>
            </Form>
          </>
        );
      }}
    </FormState>
  );
}
```

In addition to being propagated down to their respective `fields`, these client-side validation errors can be accessed together at the top level via the `errors` array, in the same way as your remote errors (returned from `onSubmit`) and external errors (see below).

To learn more about building validators, and the built in functions exposed by this package, check out the [validators guide](validators.md).

## External errors

You can use the `externalErrors` prop to supply `<FormState />` with external errors. This is useful for displaying errors that occur outside of the normal form submit flow. These errors will be available alongside regular errors via the `errors` array.

```typescript
class MyComponent extends React.Component {
 state = {
   externalErrors: [{message: 'Example error', field: 'foo'}]
 }
  render() {
   const {externalErrors} = this.state;
    return (
     <FormState
       initialValues={{foo: ''}}
       externalErrors={externalErrors}
       onSubmit={async (formDetails) => {
         const response = await submitFormMutation(formDetails);
           if (response.errors) {
              // we still need to clear the errors ourselves because formstate
             // doesn't know what they represent or when to clear them
              this.setState({externalErrors: null});
              return response.errors;
          }
       }}
     >
       {({fields, errors}) => {
          return (
            <Banner>
             {/* the externalErrors get seamlessly added to the errors array */}
              {errors.map(error => <li>{error.message}</li>)}
            </Banner>
              {/* and passed down to matching fields */}
             <TextField {...fields.foo} />
          )
       }}
     </FormState>
   )
 }
}
```

## Compound fields

The default API for generating handlers with `<FormState />` is very simple, but real world apps are often very complex. You will often have to represent editing many resources with one form. This can mean needing support for arrays of fields, fields that are nested objects, or both. `<FormState />` allows passing these complex values into `initialValues` and having your own special sub-components that use the handlers, but for most cases it's recommended to use the sub-components `<FormState.List />` and `<FormState.Nested />`.

### `<FormState.Nested />`

Sometimes your data might be best represented using a sub-object.

```typescript
initialValues={{
  firstVariant: {
    option: 'size',
    value: 'enormous',
    price: '2.00',
    sku: 'mc23',
  }
  /* other fields */
}}
```

Passing this directly into `<FormState />` will generate one field description object for the entire object, just like any other field.

This might work for some usecases if you have some kind of custom component that you just want to pass an updater to, but this can make collection values back for submission, validation, and other subtleties a pain to manage.

In cases like this you can use `<FormState.Nested />` to generate individual field descriptors for the sub-fields.

```typescript
// ProductPage.ts
import {TextField} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

export function ProductPage() {
  return (
    <FormState
      initialValues={{
        name: '',
        description: '',
        firstVariant: {
          option: 'size',
          value: 'enormous',
          price: '2.00',
          sku: 'mc23',
        }
      }}
    >
    {({fields}) => {
      return (
        <form>
          <div>
            <TextField label="Name" {...fields.name} />
            <TextField label="Description" {...fields.description} />

            <FormState.Nested field={fields.firstVariant}>
              {(fields) => {
                <TextField label="Option" {...fields.option} />
                <TextField label="Value" {...fields.value} />
                <TextField label="SKU" {...fields.sku} />
                <TextField label="Price" {...fields.price} />
              }}
            </FormState.Nested>
          </div>
        </form>
      )
    }}
    </FormState>
  );
}
```

### `<FormState.List />`

Sometimes your data might be best represented using an array of objects.

```typescript
initialValues={{
  variants: [{
    option: 'size',
    value: 'enormous',
    price: '2.00',
    sku: 'mc23',
  }, {
    option: 'size',
    value: 'teensy',
    price: '0.20',
    sku: 'mc25',
  }]
  /* other fields */
}}
```

Passing this directly into `<FormState />` will generate one field description object for the entire array, just like any other field.

This might work for some usecases if you have some kind of custom component that you just want to pass an updater to, but this can make collecting values back for submission, validation, and other subtleties a pain to manage. It can also make adding and removing fields quite code intensive.

In cases like this you can use `<FormState.List />` to generate individual field descriptors for the sub-fields of each object in the array. `<FormState.List />` will render the `children` function you give it once for each item in the `field` array you give it, passing in a `fields` object with the same type of signature as `<FormState.Nested />`.

```typescript
// ProductPage.ts
import {TextField} from '@shopify/polaris';
import FormState from '@shopify/react-form-state';

export function ProductPage() {
  return (
    <FormState
      initialValues={{
        name: '',
        description: '',
        variants: [{
          option: 'size',
          value: 'enormous',
          price: '2.00',
          sku: 'mc23',
        }, {
          option: 'size',
          value: 'teensy',
          price: '0.20',
          sku: 'mc25',
        }],
      }}
    >
    {({fields}) => {
      return (
        <form>
          <div>
            <TextField label="Name" {...fields.name} />
            <TextField label="Description" {...fields.description} />

            <FormState.List field={fields.variants}>
              {(fields) => {
                <TextField label="Option" {...fields.option} />
                <TextField label="Value" {...fields.value} />
                <TextField label="SKU" {...fields.sku} />
                <TextField label="Price" {...fields.price} />
              }}
            </FormState.List>
          </div>
        </form>
      )
    }}
    </FormState>
  );
}
```

By default `<List />` will use the `index` of your objects in the array as React `key`s. This is problematic if your array items could be re-ordered, so it is highly recommended you provide a `getChildKey` function. Your `getChildKey` will be passed each item in your array, and expects you to return a unique value that can be used to identify that item. This could be an `id` if that exists, or something else that makes sense in your usecase.

For our example above, it makes sense to assume that each combination of `option` and `value` is unique.

```typescript
<FormState.List
  field={fields.variants}
  getChildKey={(variant) => `${variant.option}-${variant.value}`}
>
```

## Putting it all together

The following example shows how you can use everything this documentation covered to build a full [Polaris](https://polaris.shopify.com) styled page.

[Try it out in codesandbox](https://codesandbox.io/s/zx387x0vmx)

```typescript
import * as React from 'react';
import {
  AppProvider,
  Page,
  TextField,
  FormLayout,
  PageActions,
  Spinner,
  Banner,
  Stack,
  Card,
  Layout,
  ButtonGroup,
  Button,
  Form,
} from '@shopify/polaris';
import FormState, {
  validators,
  validateList,
  validateNested,
  arrayUtils,
} from '@shopify/react-form-state';

const {
  required,
  requiredString,
  numericString,
  nonNumericString,
  lengthMoreThan,
} = validators;

interface Variant {
  option: string;
  value: string;
  price: string;
}

interface Props {
  initialValues: {
    title: string;
    description: string;
    sku: string;
    quantity: string;
    firstVariant: Variant;
    variants: Variant[];
  };
}

function CreateProductPage({initialValues}: Props) {
  return (
    <AppProvider>
      <FormState
        initialValues={initialValues}
        validators={{
          title: requiredString('Required'),
          quantity: numericString('Must be a number'),
          sku: lengthMoreThan(3, 'Must  be longer than 3 characters'),
          firstVariant: validateNested({
            option: required('required'),
            price: numericString('value must be numeric'),
          }),
          variants: validateList({
            option: nonNumericString('option must be nonNumeric'),
            price: numericString('value must be numeric'),
          }),
        }}
        onSubmit={({fields}) => {
          /*
            In a real project you would make some kind of asynchronous call here
            such as a graphQL mutation or a POST request, and return an array of errors if you encounter any.
          */
          return [{message: 'server error'}];
        }}
      >
        {formDetails => {
          const {
            fields,
            dirty,
            reset,
            submit,
            submitting,
            errors,
          } = formDetails;
          const {
            title,
            description,
            sku,
            quantity,
            variants,
            firstVariant,
          } = fields;

          const submitAction = {
            content: 'Save',
            onAction: submit,
            disabled: !dirty || submitting,
            loading: submitting,
          };

          const resetAction = {
            content: 'Reset',
            onAction: reset,
            disabled: !dirty || submitting,
          };

          const errorBanner = errors.length > 0 && (
            <Banner status="critical">
              <ul>
                {errors.map(error => (
                  <li key={`${error.message}${error.field}`}>
                    {error.message}
                  </li>
                ))}
              </ul>
            </Banner>
          );

          function addVariant() {
            variants.onChange(
              arrayUtils.push(variants.value, {
                option: '',
                value: '',
                price: '0',
              }),
            );
          }

          return (
            <Form onSubmit={submit}>
              <Page
                title="Products"
                primaryAction={submitAction}
                secondaryActions={[resetAction]}
              >
                <Layout>
                  <Layout.Section>{errorBanner}</Layout.Section>

                  <Layout.Section>
                    <Stack distribution="center">
                      {submitting && <Spinner />}
                    </Stack>

                    <Card>
                      <Card.Section>
                        <FormLayout>
                          <TextField label="Title" {...title} />
                          <TextField label="Description" {...description} />
                          <TextField label="SKU" {...sku} />
                          <TextField
                            type="number"
                            label="Quantity"
                            {...quantity}
                          />
                        </FormLayout>
                      </Card.Section>
                    </Card>
                  </Layout.Section>

                  <Layout.Section>
                    <Card title="Variants">
                      <Card.Section title="Default">
                        <FormLayout>
                          <FormState.Nested field={firstVariant}>
                            {({option, value, price}) => (
                              <React.Fragment>
                                <TextField label="option" {...option} />
                                <TextField label="value" {...value} />
                                <TextField label="price" {...price} />
                              </React.Fragment>
                            )}
                          </FormState.Nested>
                        </FormLayout>
                      </Card.Section>

                      <Card.Section>
                        <FormLayout>
                          <FormState.List field={variants}>
                            {({option, value, price}) => (
                              <React.Fragment>
                                <TextField label="option" {...option} />
                                <TextField label="value" {...value} />
                                <TextField label="price" {...price} />
                              </React.Fragment>
                            )}
                          </FormState.List>
                          <ButtonGroup>
                            <Button onClick={addVariant} primary>
                              Add variant
                            </Button>
                          </ButtonGroup>
                        </FormLayout>
                      </Card.Section>
                    </Card>
                  </Layout.Section>

                  <Layout.Section>
                    <PageActions
                      primaryAction={submitAction}
                      secondaryActions={[resetAction]}
                    />
                  </Layout.Section>
                </Layout>
              </Page>
            </Form>
          );
        }}
      </FormState>
    </AppProvider>
  );
}
```
