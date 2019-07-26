# Creating Releases

**Note🗒️** The following steps require admin access to the Shopify/quilt GitHub repo.

## 1. Preparing local environment

- Ensure you have the latest `master` branch including all tags:

```
git checkout master && git pull
```

**Note** `git pull` should be used instead of `git pull origin master` to ensure that tags are pulled as well.

## 2. Updating `CHANGELOG.md`

- Go into every package that is being release. Edit `CHANGELOG.md` by moving any line items from `Unreleased` section into a new release with the new section with the new version number and today's date as title. (eg. `[1.0.0] - 2019-07-24`).

- Stage the `CHANGELOG.md` changes using

```
git add .
```

**Note🗒️** lerna will make these staged changes part of the publish commit during the final confirmation of `yarn release`

## 3. Versioning and Tagging

- Begin the release process:

```
yarn release
```

- Follow the prompts to choose a version for each package. If you are releasing a new package, we encourage you to version it `1.0.0` to start with.

**Note🗒️** Quilt packages adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 4. Pushing Changes

The following will push the changes and new tags to GitHub

```
git push origin master --follow-tags
```

## 5. Deploying to npm

- Log in to [Shipit](https://shipit.shopify.io/shopify/quilt/production)

- When CI is 🍏 on the commit titled `Publish`, press `Deploy` to update packages on npm.
