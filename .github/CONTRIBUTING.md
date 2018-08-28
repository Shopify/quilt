# Quilt: a contributor's guide

This guide is tailored to Shopifolk, although we welcome contributions from [the broader development community](#external-contributors) as well.

## [Code of conduct](./CODE_OF_CONDUCT.md).

Shopify has adopted a Code of Conduct that we expect Quilt contributors to adhere to. Please read the [full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Getting Started

```bash
dev clone quilt
dev up
```

**Note** In order for tests to run properly, you may need to first run `dev build`

## Development

### Getting productive

We are adding documentation as we go in the [Web Foundations repo](https://github.com/Shopify/web-foundation). There you will find our [decision records](https://github.com/Shopify/web-foundation/tree/master/Decision%20records), [principles](https://github.com/Shopify/web-foundation/tree/master/Principles), [best practices](https://github.com/Shopify/web-foundation/tree/master/Best%20practices) and [styleguides](https://github.com/Shopify/web-foundation/tree/master/Styleguides) for writing and [testing](https://github.com/Shopify/web-foundation/blob/master/Best%20practices/Testing.md) different kinds of components.

The [documentation](../documentation) directory in this repo covers the more granular technical aspects of this project. Of particular note for new folks are the following:

- [Guides](../documentation/guides): a set of guides to help you get started developing with `web`. Of particular note for developers just starting on the project are our guides to [using the hot-reloading playground mode for rapid development](../documentation/guides/playground.md), [writing a new section](../documentation/guides/writing-a-new-section.md), and our list of [legacy patterns](../documentation/guides/legacy-patterns.md) that you should seek to avoid.
- [Architecture](../documentation/architecture): overviews of the structure of the client, server, and shared code in this repo.
- [FAQ](../documentation/FAQ.md): common questions about the project in general, as well as some of the technical pieces within.
- [Resources](../documentation/resources.md): good resources for understanding this project’s tech stack.
- [Getting started](../documentation/getting-started.md): some tools we recommend for getting the most out of this project.

### Emoji commits

We have found that prefacing a commit message or PR title with an emoji can be a great way to improve the developer experience when browsing the repo code. Additionally, it is a terse way to convey information. Many of our contributors have found the guide at https://gitmoji.carloscuesta.me/ to be helpful in preserving this dynamic.

### Documentation

If your change affects the public API of any packages within Quilt (i.e. adding or
changing arguments to a function, adding a new function, changing the
return value, etc), please ensure the documentation is also updated to
reflect this. Documentation is in the `README.md` files of each package. If further documentation is needed please communicate via Github Issues.

### Testing

The packages in Quilt are used in mission-critical production scenarios. As such, we try not to merge any untested code. The coverage doesn't strictly need to be 100% across the board, but testing should remain a primary concern.

### TODO Comments

TODO comments may seem like a great placeholder for work in progress. We prefer top handle this in a different way, using a combination of feature branches and github issues.

#### Follow-up Github issues

If your changes are complete in functionality, but you're not quite happy with auxillary things like documentation or testing, then feel free to make a github issue to track the work that needs to be done. These issues should be linked in the PRs that need a bit more work. This will allow context to be drawn from the code in a more trackable way than a TODO comment. Also, it allows the PR reviewers to see that the documentation or testing is purposefully incomplete and that an appropriate issue exists to track the follow-up work.

#### Feature branches

Another option, if you'd like to break work down into reviewable chunks, is to use a feature branch. This would be an initially empty branch that contains the entirety of your feature. Additional units of work can be distributed across several PRs into the feature branch, merged independently, and then the feature branch can be merged as a complete unit into the master branch, when it's ready.

## Releasing

The release process currently invovles some manual steps to complete. Please ping one of the repo owners in the `#web-foundations` slack channel when you're ready to merge a new PR into `master`, and we will orchestrate a new release.

### For repo owners

**Note** these steps require admin access to the `Shopify/quilt` github repo.

1. Ensure you have the latest `master` branch including all tags:

```
git checkout master && git pull origin master
```

2. Begin the release process:

```
yarn release
```

3. Follow the prompts to choose a version for each package.

**Note** This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

4. Log in to [Shipit](https://shipit.shopify.io/shopify/quilt/production)

5. When CI is 🍏 on the tag commit, press `Deploy` to update packages on npm.

## External Contributors
