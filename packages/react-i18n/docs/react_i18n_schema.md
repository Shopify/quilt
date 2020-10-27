# Introduction <!-- omit in toc -->

React I18n is a schema comprised of a structure of nested key-value pairs (KVPs). This document captures the nuances of the constraints placed on the schema by the different levels of concern.

<!-- Created using "Markdown All in One" extension for VS Code -->
- [History](#history)
  - [Version 2.0](#version-20)
  - [Version 1.0](#version-10)
- [Versioning](#versioning)
- [Basic Structure](#basic-structure)
- [Pluralization](#pluralization)
  - [Cardinal Pluralization](#cardinal-pluralization)
    - [Reserved cardinal pluralization keys](#reserved-cardinal-pluralization-keys)
    - [Invalid cardinal pluralization keys](#invalid-cardinal-pluralization-keys)
    - [Detecting cardinal pluralization contexts](#detecting-cardinal-pluralization-contexts)
  - [Ordinal Pluralization](#ordinal-pluralization)
    - [Invalid ordinal pluralization keys](#invalid-ordinal-pluralization-keys)
    - [Detecting ordinal pluralization contexts](#detecting-ordinal-pluralization-contexts)
- [Serialization](#serialization)
  - [Serialization to JSON](#serialization-to-json)
    - [Comments](#comments)
  - [Serialization to JSON+Comments](#serialization-to-jsoncomments)
- [Appendix A: Comparison with Rails I18n](#appendix-a-comparison-with-rails-i18n)
    - [Root locale key](#root-locale-key)
    - [Pluralization](#pluralization-1)
    - [Interpolation](#interpolation)

# History

## Version 2.0

* Use the more precise language: `"Pluralization" -> "Cardinal Pluralization"`
* Clarify that a cardinal pluralization context only includes immediate children
* Add a description of how ordinal pluralization works.
    * This was an omission in the version `1.0` specification.
* Adjust the rules for reserved cardinal pluralization keys to account for their usage in ordinal pluralization contexts

## Version 1.0

Prior to the creation of this document, the React I18n schema was not documented.
With the creation of this document, the schema was specified and given the version identifier `1.0`.

# Versioning

The version identifier for the schema is made of two parts, `<major>` and `<minor>`, separated by a `.`: `<major>.<minor>`.

The `<major>` version number will be incremented any time a change is introduced that would mean that existing parsers would break while parsing the new schema. Put another way, software that supports parsing version `x.y` of the schema will always be able to parse any version `x.z`, where `z >= y`.

The `<minor>` version number will be incremented for any other changes to the schema and/or serialization formats. For example, changes that make the schema "more strict" in what is accepted as valid can be done as increments to the `<minor>` version number, since parsers of older versions are still able to parse the newer versions, albeit "more loosely" than what a modern parser would.

# Basic Structure

React I18n is made of nested dictionaries of key-value pairs (KVPs). Each of the keys are strings, and the values are either strings, or a nested dictionary.

In TypeScript, the type is a recursive definition:

```typescript
export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
```

When [serialized to JSON](#serialization-to-json), each of the dictionaries become JSON `object` types, and the keys and leaf values are both JSON `string` types.

**Example React I18n JSON file**

```json
{
  "hello": "My name is {name}",
  "parent": {
    "child_1": "I am the first child of `parent`!",
    "child_2": {
      "grandchild_1": "I am the first grandchild of `parent`!",
      "grandchild_2": "I am the second grandchild of `parent`!"
    }
  }
}
```

# Pluralization

## Cardinal Pluralization

Pluralization of cardinal numbers is handled by providing the cardinal pluralization keys required by the language as leaf KVPs, creating a "cardinal pluralization context".

**Example English file with cardinal pluralization keys:**

```jsonc
{
  "cars": {  // All the children of `cars` are in a "cardinal pluralization context"
    "one": "I have {count} car",
    "other": "I have {count} cars"
  }
}
```

Different languages require different sets of cardinal pluralization keys. For example, Polish (`pl`) has 4 required cardinal pluralization keys: `one`, `few`, `many`, and `other`. The Polish version of the previous example would be:

**Example Polish file with cardinal pluralization keys:**

```json
{
  "cars": {
    "one": "Mam {count} samochód",
    "few": "Mam {count} samochody",
    "many": "Mam {count} samochodów",
    "other": "Mam {count} samochodu"
  }
}
```

### Reserved cardinal pluralization keys

In order to avoid key collisions, the following keys are reserved for use as cardinal pluralization keys and must not be used as keys of leaf KVPs outside of a cardinal pluralization context:

* `few`
* `many`
* `one`
* `other`
* `two`
* `zero`

**Note:** There is an exception. These keys are also allowed to be present within an **ordinal pluralization context**.

These keys are derived from the names given to the cardinal pluralization rules of all languages, as defined in the [Unicode Consortium's Common Locale Data Repository (CLDR)](https://github.com/unicode-org/cldr).

This list is current as of version `37` of the CLDR. In the unlikely event that new cardinal pluralization rule names are added, they will be added to this reserved list in a future version of this specification.

**Example INVALID English file:**
```jsonc
{
  "foo": "bar",
  // 🚫 INVALID:
  // The use of `other` key outside of an ordinal pluralization context
  // makes this a cardinal pluralization context,
  // but it is missing the required `one` sibling key that English needs
  // therefore it is not a valid cardinal pluralization context.
  // It is either:
  //   * not intended to be a cardinal pluralization context (in which case the reserved `other` key needs to be renamed)
  //   * missing the required `one` sibling cardinal pluralization key (in which case the `one` key needs to be added)
  //   * meant to be part of an ordinal pluralization context (in which case it needs to be placed under an "ordinal"
  //     key and the other sibling ordinal pluralization keys need to be added)
  "other": "Other"
}
```

### Invalid cardinal pluralization keys

Furthermore, cardinal pluralization keys that are not required by the language must not be used, even within a cardinal pluralization context.

For example, even though `zero` is a required cardinal pluralization key for some languages (eg. Arabic), it is not a required cardinal pluralization key in English. Therefore, the `zero` key must not be present in an English file alongside the cardinal pluralization KVPs required by English.

**Example INVALID English file:**
```jsonc
{
  "cars": {
    "zero": "I have no cars", // 🚫 INVALID: `zero` is not a required cardinal pluralization key for English!
    "one": "I have {count} car",
    "other": "I have {count} cars"
  }
}
```

### Detecting cardinal pluralization contexts

These constraints allow for a simple algorithm for identifying cardinal pluralization contexts:

* If a node has child leaf KVPs for **any** of the cardinal pluralization keys required by the language, and the node is not `ordinal` (which would make it an [ordinal pluralization context](#ordinal-pluralization), then its **immediate** children are within a cardinal pluralization context.

**Note**: in order to be a valid cardinal pluralization context, any other required cardinal pluralization keys must also be present within the cardinal pluralization context.

## Ordinal Pluralization

Pluralization of ordinal numbers is handled by providing the ordinal pluralization keys required by the language as leaf KVPs, under an `ordinal` parent, creating an "ordinal pluralization context"

**Example English file with ordinal pluralization keys:**

```jsonc
{
  "cars": {
    "ordinal": { // The special key "ordinal" creates an ordinal pluralization context
      "one": "This is my {amount}st car", // Used for 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …
      "two": "This is my {amount}nd car", // Used for 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …
      "few": "This is my {amount}rd car", // Used for 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …
      "other": "This is my {amount}th car" // Used for 0, 4~18, 100, 1000, 10000, 100000, 1000000, …
    }
  }
}
```

Different languages require different sets of ordinal pluralization keys. For example, Polish (`pl`) only has 1 required ordinal pluralization key: `other`. The Polish version of the previous example would be:

**Example Polish file with ordinal pluralization keys:**

```json
{
  "cars": {
    "ordinal": {
      "other": "To mój {amount}. samochód"
    }
  }
}
```

### Invalid ordinal pluralization keys

Ordinal pluralization keys that are not required by the language must not be used as leaf KVPs within an ordinal pluralization context.

For example, even though `many` is a required cardinal pluralization key for some languages (eg. Italian), it is not a required ordinal pluralization key in English. Therefore, the `many` key must not be present in an English file alongside the ordinal pluralization KVPs required by English.

**Example INVALID English file:**
```jsonc
{
  "cars": {
    "ordinal": {
      "many": "This is one car of many that I own", // 🚫 INVALID: `zero` is not a required ordinal pluralization key for English!
      "one": "This is my {amount}st car",
      "two": "This is my {amount}nd car",
      "few": "This is my {amount}rd car",
      "other": "This is my {amount}th car"
    }
  }
}
```

### Detecting ordinal pluralization contexts

These constraints allow for a simple algorithm for identifying ordinal pluralization contexts:

* If a node has the special key name `ordinal`, then its **immediate** children are within a ordinal pluralization context.

**Note**: in order to be a valid ordinal pluralization context, any other required ordinal pluralization keys must also be present within the ordinal pluralization context.

# Serialization

React I18n can be serialized to different formats. Two serializations are officially defined:

* JSON+Comments
* JSON

Consumers of React I18n `2.0` schema files are expected to be able to parse files serialized into each of these serialization formats.

## Serialization to JSON

When serialized to [JSON](https://www.json.org/json-en.html), each of the dictionaries become JSON `object` types, and the keys and leaf values are both JSON `string` types.

**Example React I18n JSON file**

```json
{
  "hello": "My name is {name}",
  "parent": {
    "child_1": "I am the first child of `parent`!",
    "child_2": {
      "grandchild_1": "I am the first grandchild of `parent`!",
      "grandchild_2": "I am the second grandchild of `parent`!"
    }
  }
}
```

### Comments

React I18n does not support the use of comments when serialized to JSON. This is due to JSON's lack of support for comments.

## Serialization to JSON+Comments

`JSON+Comments` is a serialization format whose syntax is a superset of `JSON`, but a subset of [`JSON5`](https://json5.org/).

```
JSON < JSON+Comments < JSON5
```

Historically, `JSON` had support for comments, but this [was then removed](https://archive.vn/20150704102718/https://plus.google.com/+DouglasCrockfordEsq/posts/RK8qyGVaGSr). However, comments have proven to be a useful mechanism for developers to [provide additional context to translators](https://development.shopify.io/engineering/developing_at_Shopify/internationalization/providing_context_notes). The `JSON+Comments` serialization format extends the `JSON` serialization to re-add support for comments.

The `JSON+Comments` can be parsed using a `JSON5` parser, or a `JSON` parser that is not sensitive to comments.

**Example React I18n JSON+Commments file**

```jsonc
{
  // This is a context comment for `hello`!
  "hello": "My name is {name}",
  "parent": {
    "child_1": "I am the first child of `parent`!", // This is a trailing context comment for `child_1`!
    "child_2": {
      /*
        This is a multi-line
        context comment for `grandchild_1`!
      */
      "grandchild_1": "I am the first grandchild of `parent`!",
      "grandchild_2": "I am the second grandchild of `parent`!" /* This is a trailing context comment for `grandchild_2`! */
    }
  }
}
```

Comments follow the [JSON5 syntax for comments](https://spec.json5.org/#comments): `//` signals the start of a comment that ends at the end of the line. `/*` signals the start of a comment that ends with the next `*/`.

# Appendix A: Comparison with Rails I18n

React I18n's schema is loosely based on the [Rails I18n](https://guides.rubyonrails.org/i18n.html) schema.
This section compares the two schemas, in order to point out the ways in which they differ from one another.

### Root locale key

Rails I18n has a locale root key, while React I18n doesn't:

**Rails I18n:**
```yaml
en:
  foo: bar
```

**React I18n**

```json
{
  "foo": "bar"
}
```

Note the `en` (for English) locale key that is the root key for the Rails I18n file.
This key is not present in the React I18n file. The locale of a React I18n file is stored outside of the file contents. By convention, the locale is typically stored within the filename (eg. `en.json` for an English locale file).

### Pluralization

Rails I18n (when using the default backend) allows for the use of a `zero` key (regardless of the source language), while React I18n doesn't.

The use of `zero` in Rails I18n is a problematic, as there are languages (eg. Arabic) that use `zero` as a pluralization key.
This causes collisions when `zero` is supplied in a source file for a language that doesn't use the `zero` pluralization key (eg. English).

React I18n avoids this by disallowing the use of the `zero` key unless the source language requires the `zero` pluralization key.

When manually converting Rails I18n files to React I18n, use a different key (eg. `none` or `blank`) for storing strings that should be used for placeholder or empty values.

**Rails I18n:**
```yaml
en:
  cars:
    zero: "I don't have any cars" # Problematic when translating into languages that use the `zero` pluralization key
    one: "I have %{count} car"
    other: "I have %{count} car"
```

**React I18n**

```json
{
  "cars": {
    "none": "I don't have any cars",
    "one": "I have {count} car",
    "other": "I have {count} cars"
  }
}
```

### Interpolation

While neither schema defines an interpolation syntax, the most common syntax used in Rails I18n is `%{}`, while in React I18n, the most common syntax is `{}`.

**Rails I18n:**
```yaml
en:
  hello: My name is %{name}
```

**React I18n**

```json
{
  "hello": "My name is {name}"
}
```
