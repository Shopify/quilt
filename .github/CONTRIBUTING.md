# Quilt: a contributor's guide

This guide is tailored to Shopifolk, although we welcome contributions from [the broader development community](#external-contributors) as well.

## [Code of conduct](./CODE_OF_CONDUCT.md).

Shopify has adopted a Code of Conduct that we expect Quilt contributors to adhere to. Please read the [full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Ways to contribute

There are many ways to contribute to Quilt, some of which are:

- Filing [bug reports](https://github.com/Shopify/quilt/issues/new?template=BUG_REPORT.md)
- Requesting new features or packages via [an issue](https://github.com/Shopify/quilt/issues/new/choose)
  - Bringing up areas for enhancement
- Hacking away on an issue from our [backlog](https://github.com/Shopify/quilt/issues)
- Improving tests or documentation

Want to contribute, but not sure how? Find us on Slack in `#web-foundation-tech`.

## Development

### Getting Started

```bash
dev clone quilt
dev up
```

[what is dev?](#what-is-dev)

### Getting productive

We are adding documentation as we go in the [Web Foundation repo](https://github.com/Shopify/web-foundation). There you will find our [decision records](https://github.com/Shopify/web-foundation/tree/main/handbook/Decision%20records), [principles](https://github.com/Shopify/web-foundation/tree/main/handbook/Principles), [best practices](https://github.com/Shopify/web-foundation/tree/main/handbook/Best%20practices) and [styleguides](https://github.com/Shopify/web-foundation/blob/main/handbook/Styleguides) for writing and [testing](https://github.com/Shopify/web-foundation/blob/main/handbook/Best%20practices/Testing.md) different kinds of components.

The [documentation](../documentation) directory in this repo covers the more granular technical aspects of this project. Of particular note for new folks are the following:

- [Guides](../documentation/guides): a set of guides to help you get started developing with `quilt`. Of particular note for developers just starting on the project is our guide to [creating a new package](../documentation/guides/creating-a-new-package.md).
- [FAQ](../documentation/FAQ.md): common questions about the project in general, as well as some of the technical pieces within.
- [Resources](../documentation/resources.md): good resources for understanding this project’s tech stack.
- [Getting started](../documentation/getting-started.md): some tools we recommend for getting the most out of this project.

## Testing your changes in a local project

To try out your changes in another locally cloned project, you can use `yarn tophat <package-name-without-@shopify-prefix> <relative-path-to-project>`. Using this command rather than `yarn link` will set up a watcher let you make changes without needing to rerun any commands.

Example: To test my changes to `@shopify/react-form-state` in my local project named `cool-proj`, I would run `yarn tophat react-form-state ../path/to/cool-proj`.

Notes: If the package you are testing has dependencies inside Quilt itself, you will need to run `dev build` first. If you are using a build system in the consumer of the package, you may need to clear your build folder.

More usage instructions on the `tophat` command can be [found here](https://github.com/Shopify/webgen/blob/master/docs/TOPHAT.md).

### Emoji commits

We have found that prefacing a commit message or PR title with an emoji can be a great way to improve the developer experience when browsing the repo code. Additionally, it is a terse way to convey information. Many of our contributors have found the guide at https://gitmoji.carloscuesta.me/ to be helpful in preserving this dynamic.

### Documentation

If your change affects the public API of any packages within Quilt (i.e. adding or
changing arguments to a function, adding a new function, changing the
return value, etc), please ensure the documentation is also updated to
reflect this. Documentation is in the `README.md` files of each package. If further documentation is needed please communicate via Github Issues.

### Testing

The packages in Quilt are used in mission-critical production scenarios. As such, we try not to merge any untested code. The coverage doesn't strictly need to be 100% across the board, but testing should remain a primary concern.

To run the full test suite, simply run `dev test`. In order for tests to run properly, you may need to first run `dev build`

### TODO Comments

TODO comments may seem like a great placeholder for work in progress. We prefer to handle this in a different way, using a combination of feature branches and github issues.

#### Follow-up Github issues

If your changes are complete in functionality, but you're not quite happy with auxillary things like documentation or testing, then feel free to make a github issue to track the work that needs to be done. These issues should be linked in the PRs that need a bit more work. This will allow context to be drawn from the code in a more trackable way than a TODO comment. Also, it allows the PR reviewers to see that the documentation or testing is purposefully incomplete and that an appropriate issue exists to track the follow-up work.

#### Feature branches

Another option, if you'd like to break work down into reviewable chunks, is to use a feature branch. This would be an initially empty branch that contains the entirety of your feature. Additional units of work can be distributed across several PRs into the feature branch, merged independently, and then the feature branch can be merged as a complete unit into the master branch, when it's ready.

## Releasing

The release process currently involves some manual steps to complete. Please ping Web Foundations ATC in the `#web-foundation-tech` Slack channel when you're ready to merge a new PR into `master`, and we will orchestrate a new release. The repo owner can follow [this guide](../documentation/guides/release-and-deploy.md) to create a release.

**Note** Version numbers in `package.json` files should never be altered manually. This will be done via scripts as part of the release process.

## External Contributors

### Getting started

To start working on the codebase, first fork the repo, then clone it:

```
git clone git@github.com:your-username/quilt.git
```

_Note: replace "your-username" with your Github handle_

Install the project's dependencies (make sure you first have [yarn](https://yarnpkg.com/) installed):

```
yarn
yarn lerna bootstrap
```

### What is dev?

`dev` is a tool to standardize a small set of common tasks across all projects at Shopify. If you're wondering how to execute the `dev <cmd>` commands as an external contributor, you can see where they are defined in this project's [`dev.yml`](../dev.yml) file, which is pretty self-explanatory.
