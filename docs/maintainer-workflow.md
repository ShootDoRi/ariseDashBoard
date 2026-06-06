# Maintainer Workflow

## Weekly Sync

1. Confirm the Google Sheet columns are ordered as `아이디, 태그, 점수, 순위`.
2. Update `community-dashboard.config.json` locally if the `sheetUrl`, sheet range, or `weekLabel` changed.
3. Run `npm run sync -- --config community-dashboard.config.json`.
4. Review `src/json/arise/sheet_data.json` and `src/json/arise/flow/sheet_data_flow_final.json` before committing public sample updates.
5. Run `npm run test`, `npm run build`, and `npm run secret-scan`.

## Google Sheet Rules

1. Use `태그` as the stable identity key across weeks.
2. Treat the input `순위` column as optional reference only. Sync recalculates `Rank` from `점수`.
3. Never commit private Sheet URLs, API keys, or raw member data.

## Release

1. Update `CHANGELOG.md`.
2. Tag the release as `vX.Y.Z`.
3. Attach screenshots or GIFs that use only anonymous sample data.
4. Open follow-up issues for Google Sheets adapters, ranking edge cases, or dashboard polish.
