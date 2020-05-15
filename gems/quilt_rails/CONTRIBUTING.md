# Contributing

## Development

To get started with gem development:

```
dev clone quilt
dev cd quilt
cd gems/quilt_rails
dev up
```

For Node development, see [the Node contributors docs](.github/CONTRIBUTING.md).

## Changes

All notable changes should be included in the [`CHANGELOG.md`](CHANGELOG.md).

## Releasing

**Note:** Gem releases will _not_ publish Node packages. If the gem depends on changes in the Node library, you _must_ [publish a Node release first](../../documentation/guides/release-and-deploy.md).

1. `cd gems/quilt_rails`
1. Update `version.rb` and `CHANGELOG.md` to your new desired version
1. Run `bundle install`
1. Stage the changes with `git add -A`
1. Commit the resulting changes, `git commit -m "Release quilt_rails v<new-version>"`
1. Create a tag, `git tag v<new-version>`
1. `git push origin master --tags`
1. Head to [ShipIt](https://shipit.shopify.io/shopify/quilt/gem) to deploy the release to Ruby Gems.
