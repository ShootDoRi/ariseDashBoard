# Maintainer Workflow

## Weekly Sync

1. Update `community-dashboard.config.json` locally if the sheet range changed.
2. Run `npm run sync -- --config community-dashboard.config.json`.
3. Review the generated JSON for anonymization before committing public sample updates.
4. Run `npm run test`, `npm run build`, and `npm run secret-scan`.

## Release

1. Update `CHANGELOG.md`.
2. Tag the release as `vX.Y.Z`.
3. Attach screenshots or GIFs that use only anonymous sample data.
4. Open follow-up issues for schema adapters or dashboard polish.
