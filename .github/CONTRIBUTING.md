# How to contribute

We ❤️ pull requests. If you'd like to fix a bug, contribute a feature or
just correct a typo, please feel free to do so, as long as you follow
our [Code of conduct](./CODE_OF_CONDUCT.md).

If you're thinking of adding a big new feature, consider opening an
issue first to discuss it to ensure it aligns to the direction of the
project (and potentially save yourself some time!).

## Getting Started

To start working on the codebase, first fork the repo, then clone it:

```
git clone git@github.com:your-username/quilt.git
```

_Note: replace "your-username" with your Github handle_

Install the project's dependencies (make sure you first have [yarn](https://yarnpkg.com/) installed):

```
yarn
```

Write some features.

Add some tests and make your change. Re-run the tests with:

```
yarn test
```

## Emoji commits

We have found that prefacing a commit message or PR title with an emoji can be a great way to improve the developer experience when browsing the repo code. Additionally, it is a terse way to convey information. Many of our contributors have found the guide at https://gitmoji.carloscuesta.me/ to be helpful in preserving this dynamic.

## Documentation

If your change affects the public API of any packages within Quilt (i.e. adding or
changing arguments to a function, adding a new function, changing the
return value, etc), please ensure the documentation is also updated to
reflect this. Documentation is in the `README.md` files of each package. If further documentation is needed please communicate via Github Issues.

## Testing

The packages in Quilt are used in mission-critical production scenarios. As such, we try not to merge any untested code. The coverage doesn't strictly need to be 100% across the board, but testing should remain a primary concern.

## TODO Comments

TODO comments may seem like a great placeholder for work in progress. We prefer top handle this in a different way, using a combination of feature branches and github issues.

### Follow-up Github issues

If your changes are complete in functionality, but you're not quite happy with auxillary things like documentation or testing, then feel free to make a github issue to track the work that needs to be done. These issues should be linked in the PRs that need a bit more work. This will allow context to be drawn from the code in a more trackable way than a TODO comment. Also, it allows the PR reviewers to see that the documentation or testing is purposefully incomplete and that an appropriate issue exists to track the follow-up work.

### Feature branches

Another option, if you'd like to break work down into reviewable chunks, is to use a feature branch. This would be an initially empty branch that contains the entirety of your feature. Additional units of work can be distributed across several PRs into the feature branch, merged independently, and then the feature branch can be merged as a complete unit into the master branch, when it's ready.

## Releasing a new version

We're working on improving the release experience for new contributors. In the meantime, please ping one of the `quilt` repo owners when you're ready to merge a new PR into `master`, and we will help you with orchestrating a new release via Shipit.

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
