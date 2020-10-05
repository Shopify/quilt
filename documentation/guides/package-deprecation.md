# Deprecating a package

## 1. Update `packages/{deprecate-package-name}/README.md` and `packages/{deprecate-package-name}/CHANGELOG.md`

A note should be added to both of those files.

Showing prominently

- The last version supported.
- Alternate to the deprecate package.

## 2. Delete most files in `packages/{deprecate-package-name}`

Leaving only `README.md` and `CHANGELOG.md`
(It is important to delete `package.json` so lerna will no longer pick it up for future release.)

## 3. Delete TS package project reference

Delete the line referencing the deprecate package from [`packages/tsconfig.json`](../../packages/tsconfig.json)

## 4. Global search deprecate package in quilt

Do a global search in quilt for

- Any package with `{deprecate-package-name}` listed as dependency
- Any documentation that reference `{deprecate-package-name}`

and update those accordingly.

## 5.Update quilt README

run `yarn plop docs` to remove `{deprecate-package-name}` from the main README

## 6. Create your deprecation PR

Create your PR with all the above changes and follow the normal PR review protocol to merge into master.

## 7. Deprecate the package on npm

While your PR is being review, follow [npm doc](https://docs.npmjs.com/cli/deprecate) to construct and run the deprecation command.

(**Note** Your will need npm permission to run this command, Shopifolk should follow the instructions from this [Discourse issue](https://discourse.shopify.io/t/how-can-i-deprecate-an-npm-package-version/6652) or ping @Shopify/web-foundation team to do so.)
