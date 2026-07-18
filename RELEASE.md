# Release process

To release a new version of the libraries, you should:

1. Checkout to a new branch named `release-vX.Y.Z` from main.
2. Bump the version of the libraries running [npm-bump.go](./scripts/npm-bump/npm-bump.go) `go run ./scripts/npm-bump <new version>`. For example: `go run ./scripts/npm-bump 1.2.3`.
3. Run `npm install`
4. Commit these changes - as a standalone commit ("Prepare release vX.Y.Z") or as part of your changes.
5. Push the changes (new version(s)) and create a PR.
6. After the PR is merged, checkout to and update the main.
7. Run [release.go](./scripts/release/release.go) `go run ./scripts/release`.

Further actions will then be triggered on GitHub side (see release stage in the [CI](./.github/workflows/ci.yml)).

## Publishing to GitHub Packages

This repository also includes a dedicated workflow to publish npm workspaces to GitHub Packages:
`.github/workflows/publish-github-packages.yml`.

> Publishing is restricted to refs that are on branch `shadecdn`.

### Trigger options

1. **Tag-based automatic publish**
   - Push a semver tag starting with `v` (for example `v0.55.0` or `v0.55.0-rc.1`).
   - The workflow extracts the version from the tag and validates all workspace versions match it.
2. **Manual publish (`workflow_dispatch`)**
   - Run the workflow manually from GitHub Actions.
   - Provide `version` and optional `dist_tag`.
   - Optionally provide `npm_scope` (for example `@your-org`); by default it uses the repository owner.
   - Use `dry_run=true` to validate the workflow without publishing.

### Dist-tag rules

- If `dist_tag` is explicitly set in manual run, that value is used.
- Otherwise:
  - prerelease versions (for example `0.55.0-rc.1`) publish with `next`
  - stable versions (for example `0.55.0`) publish with `latest`

### Published workspaces

- `client`
- `components`
- `plugin-system`
- `dashboards`
- `explore`

### Required permissions/secrets

- Workflow uses `GITHUB_TOKEN` with `packages: write` permission.
- Consumers must authenticate against `https://npm.pkg.github.com` to install these packages.

### Important for forks

GitHub Packages npm publication requires package scope to match your owner/org scope.
If your package names are still `@perses-dev/*`, publishing from a forked org/user will fail.
Update workspace `name` fields and cross-workspace dependencies to your own scope first.

## GitHub runbook (step-by-step)

### A) Publish by tag (recommended)

1. Ensure versions are already bumped in all workspaces and merged to `shadecdn`.
2. Create and push a release tag from your local clone:
   - `git tag v0.54.0-rc.1`
   - `git push origin v0.54.0-rc.1`
3. In GitHub, open **Actions** -> **publish-github-packages**.
4. Open the run triggered by the tag and verify:
   - version check passed
   - scope check passed
   - each workspace published successfully
5. In **Packages** on GitHub, confirm new versions are visible.

### B) Publish manually from GitHub UI

1. Open **Actions** -> **publish-github-packages**.
2. Click **Run workflow**.
3. Select branch: `shadecdn`.
4. Fill inputs:
   - `version`: e.g. `0.54.0-rc.1`
   - `npm_scope` (optional): e.g. `@rafaysystems-perses` (defaults to repository owner)
   - `dist_tag` (optional): e.g. `next` or `latest`
   - `dry_run`: `true` first for validation, then `false` for real publish
5. Click **Run workflow** and monitor logs.
6. Re-run with `dry_run=false` after a successful dry run.

### C) Verify consumer install

1. In a downstream private repo, add:
   - `.npmrc` scope mapping for `@rafaysystems-perses`
   - token with `read:packages` + `repo`
2. Run:
   - `npm i @rafaysystems-perses/components@<version>`
3. If install fails, use troubleshooting in `CONSUMING_PRIVATE_PACKAGES.md`.
