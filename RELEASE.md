# Release guide

This repo publishes to npm from GitHub Actions when a tag matching `v*` is pushed.

Workflow reference: `.github/workflows/npm-publish.yml`

## Patch release (`x.y.z` -> `x.y.(z+1)`)

1. Ensure branch is up to date and tests pass.
2. Bump version (creates commit + tag):

   ```bash
   pnpm version patch
   ```

3. Push commit and tag:

   ```bash
   git push origin main --follow-tags
   ```

4. Verify the tag exists remotely:

   ```bash
   git ls-remote --tags origin | tail
   ```

5. Watch the workflow run on GitHub and confirm npm publish succeeded.

## Optional local helper script

- Copy `scripts/release-patch-local.sh.example` to `scripts/release-patch-local.sh`.
- Run:

  ```bash
  ./scripts/release-patch-local.sh
  ```

The local script is intentionally gitignored.
