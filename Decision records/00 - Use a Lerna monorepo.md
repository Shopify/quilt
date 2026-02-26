# Decision to use a Lerna monorepo

## Date

March 26, 2018

## Contributors

* [Mallory Allen](https://github.com/TheMallen)
* [Tzvi Melamed](https://github.com/tzvipm)

## Summary

We implement our common non-tooling non-polaris libraries as a monorepo based on [Lerna](https://github.com/lerna/lerna). This improves developer efficiency, discoverability, code-sharing, and helps us build for the long-term.

## Problem space

The web foundation team's number of open source packages is set to grow exponentially as we pull libraries out of web. As of now we estimate [at least 19 new libraries](https://github.com/Shopify/web/projects/17) will need to be available to our React web projects.

In the past we've tried pulling common bits of functionality into some chunky overly-broadly-named repos, such as [@shopify/javascript-utilities](https://github.com/Shopify/javascript-utilities) and [@shopify/react-utilities](https://github.com/Shopify/react-utilities). We wanted to avoid problems with maintaining highly granular packages by essentially packing multiple simple packages into domain-based mega-packages. However, thanks to the dependency between the two, even at this level these ended up underdeveloped and poorly maintained. They fell victim to the same set of problems that most multi-repo dependency graphs must overcome:

* Testability - Packages with dependencies are hard to test together
* Developer Ergonomics - Packages with dependencies are hard to develop locally due to shortcomings of NPM / Yarn link
* Grokability - It's hard to conceptualize multi-repo changes or refactors with PRs across different repos
* Efficiency - It’s a major time sink to get reviews and tophats on several PRs to several repos in a row for one small change to a dependency
* Startup Cost - Having to clone more repos discourages contribution to packages
* Discoverability - It’s difficult to know what repos exist to suit your needs when they’re only findable via search engine
* Boilerplate - Developers must rewrite build and linting configuration, or at least include all the necessary libraries each time a new package is exposed

In addition, the overly broad and vague naming on these packages made it difficult to reason about what should and should not be in them.

Since we have at least 5 dependant projects, and need to provide a stable, fast-iterating backbone of utilities to all of them as soon as possible, we decided for this project we would change our model.

## Solution

Broadly speaking we evaluated:

* Housing our libraries in a monorepo. A single repository holding the code of multiple projects, each of which can be deployed as a separate npm package. The individual packages in the monorepo can be dependents of each other, or they can have no connection.
  * using [lerna](https://github.com/lerna/lerna)
  * using yarn workspaces with [wsrun](https://github.com/whoeverest/wsrun)
  * using [oao](https://github.com/guigrpa/oao)
* Continuing to create additional github repositories for each new javascript package, while enhancing our workflows for creating and maintaining multiple interdependant packages.
  * using [builder](http://formidable.com/open-source/builder/)
  * using [yeoman](http://yeoman.io/)
  * using [sewing-kit](https://github.com/Shopify/sewing-kit)
  * using default configs copied between repos

To explain how we came to the specific answers that we did, it's best to divide it into two parts.

### monorepo

We feel that a monorepo is our best bet for building out all the necessary packages quickly in a maintainable, discoverable way.

Advantages of using a monorepo include:

* common and universally enforceable testing, linting between packages
* easy local development of features which need to change multiple packages
* easy deployment of multiple dependant packages simultaneously
* less time spent creating prs, pinging reviewers on multiple repos
* better discoverability, visibility for other libraries by developers who already use one part of the monorepo
* easier sharing of utility scripts and generators across packages
* significantly easier to start a new package
* less github repos on our organization

Problems with monorepo strategies include:

* having to maintain support for them in our deployment tooling (shipit) and build scripts
* all the problems with testing and locally developing a web of packages persist for packages outside the monorepo
* does not help keep other, dependant, projects up to date on libraries within the repo
* a large multiproject repo can be intimidating to contribute to for newcomers

Since several of these painpoints are not unique to monorepos, we felt that the benefits outweighed them.

### lerna

Lerna is a tool for managing monorepo style codebases in javascript, built by the folks at Babel.

We feel that lerna is the best solution for javascript monorepos we can choose at the moment. No other solution we found matched all of it's features:

* Fast thanks to under the hood usage of yarn workspaces
* Parallelization support for running commands against multiple packages
* Supports automatic publishing of only updated packages
* Supports independent versioning

On top of that we have a working shipit integration for it, which should help us to get ramped up quickly.

### More details

For more insight on our explorations see:

* [decision rough notes](https://paper.dropbox.com/doc/Decision-Explorations-Mono-or-Many-repo-LNkDLM55dNzR2WK4ROtZr#:a2=-193436694).
* [lerna tests repo](https://github.com/TheMallen/lerna-tests)
* [extraction](https://github.com/Shopify/extraction-test-import-remote) [test](https://github.com/Shopify/extraction-test-react-utilities) [repos](https://github.com/Shopify/extraction-test-browser)
* [simple yeoman generator for libraries](https://github.com/Shopify/generator-shopify-library)
* [yarn workspace / lerna monorepo comparison (see commits)](https://github.com/Shopify/shopify-utilities)

## Tripwires

### Build Times

Build times will likely be worse in a mono-repo than they are in multiple small repos. We expect this to be manageable and worth the tradeoffs. If build times exceed 5 minutes then we will need to re-evaluate this decision.

### Developer Flow

The monorepo approach requires some manual steps that devs probably may not have done before. We will try to be explicit in our guidance for devs, and to maintain easy package.json commands for common tasks, but if we see a lot of malformed version bumps and confusion we will need to re-evaluate.

### Shipit Integration

Shipit currently supports JS monorepos through lerna. This support is relatively experimental, and far from battle tested. If we find ourselves spending more than an 5 hours in a week debugging / fixing shipit issues, we should re-evaluate our choices.
