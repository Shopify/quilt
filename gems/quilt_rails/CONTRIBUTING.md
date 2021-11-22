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

**Note:** Gem releases will _not_ publish Node packages. If the gem depends on changes in the Node library, you _must_ [publish a Node release first](../../.github/CONTRIBUTING.md#releasing).

1. `cd gems/quilt_rails`
2. Do a `dev up` to make sure you're running on the correct version of Ruby
3. Update `lib/quilt_rails/version.rb` and `CHANGELOG.md` to your new desired version
4. Run `bundle install`
5. Stage the changes with `git add -A`
6. Commit the resulting changes, `git commit -m "Release quilt_rails v<new-version>"`
7. Create a tag, `git tag v<new-version>`
8. `git push origin main --tags`
9. Head to [ShipIt](https://shipit.shopify.io/shopify/quilt/gem) to deploy the release to Ruby Gems.
