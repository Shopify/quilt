# Creating Releases

Changelogs and releases are managed using [`changesets`](https://github.com/changesets/changesets).

## Performing a mainline release

We have a [GitHub Action](https://github.com/Shopify/quilt/blob/main/.github/workflows/release.yml) that leverages [`changesets/action`](https://github.com/changesets/action) to handle the release process.

Upon merging PRs with a changeset entry, it shall create a "Version Packages" PR ([example](https://github.com/Shopify/quilt/pull/2309)) that shall contain any changeset changes since the last release.

To perform a release:

- Find the [currently open "Version Packages" PR](https://github.com/Shopify/quilt/pulls?q=is%3Apr+is%3Aopen+author%3Aapp%2Fgithub-actions+%22Version+Packages%22)
- Note that by default all required CI checks are absent. This is expected as the pull request and commit are created using the default GITHUB_TOKEN access token, which [skips downstream events to prevent infinite loops](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow).
- Merge the PR by checking the `Merge without waiting for requirements to be met (administrators only)` checkbox and choosing `Squash and merge`. We consider skipping the required checks to be acceptable as we are confident that these automated updates of `package.json` and `CHANGELOG.md` would not cause CI to fail.

The `Release` action shall run on the merge commit on the `main` branch, and shall publish the npm packages and create a GitHub tag and release for each package that is referenced in the PR. You can find the action log by looking at the release commit status on the merge commit.

## Performing a snapshot release

[Snapshot releases](https://github.com/changesets/changesets/blob/main/docs/snapshot-releases.md) publish the state of a single PR. This lets you rapidly test a PR in a consuming project without dealing with `yalc` and its occasional weirdness.

To perform a snapshot release:

- Ensure your PR contains at least one changeset entry.
- Comment `/snapit` on your PR.

The `Snapit` action shall run, and shall publish a new version of the packages in your PR's changeset entry with the `snapshot` dist tag. On sucessful publication a comment shall be posted in the issue detailing the published packages and details on how to use them in your consuming project.

This functionality is only available in PRs that point to a branch in the `Shopify/quilt` repository - PRs from forks are not supported.
