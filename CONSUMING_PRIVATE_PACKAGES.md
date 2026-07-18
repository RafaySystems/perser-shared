# Consuming Private GitHub Packages

This guide explains how to consume `@rafaysystems-perses/*` private npm packages from GitHub Packages.

## Package registry

All packages are published to:

- `https://npm.pkg.github.com`

Scope:

- `@rafaysystems-perses`

## 1) Local development setup

Create or update `~/.npmrc`:

```ini
@rafaysystems-perses:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxx_your_token
```

Token requirements (for private packages):

- `read:packages`
- `repo`

Then install normally in your consumer repo:

```bash
npm i @rafaysystems-perses/components@<version>
npm i @rafaysystems-perses/dashboards@<version>
npm i @rafaysystems-perses/explore@<version>
npm i @rafaysystems-perses/plugin-system@<version>
```

## 2) GitHub Actions setup (consumer repo)

### Add secret

In the consumer repository, add:

- `GH_PACKAGES_TOKEN`: a PAT with `read:packages` + `repo`

### Workflow snippet

```yaml
permissions:
  contents: read

steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 22
      cache: npm
      registry-url: https://npm.pkg.github.com

  - name: Configure npm auth
    run: |
      echo "@rafaysystems-perses:registry=https://npm.pkg.github.com" >> ~/.npmrc
      echo "//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}" >> ~/.npmrc
    env:
      GH_PACKAGES_TOKEN: ${{ secrets.GH_PACKAGES_TOKEN }}

  - run: npm ci
```

## 3) Publishing from this repo

Publishing from this repository is handled by:

- `.github/workflows/publish-github-packages.yml`

For publish, this repo uses `GITHUB_TOKEN` with `packages: write`.

## 4) Troubleshooting

- **401/403 on install**: token missing/invalid scopes (`read:packages`, `repo`) or no package access.
- **404 for package**: version/tag not published, wrong scope, or wrong registry.
- **Installs from npmjs.org instead of GitHub Packages**: missing scope mapping in `.npmrc`.
