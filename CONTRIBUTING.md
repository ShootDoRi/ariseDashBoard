# Contributing

Thanks for improving Community Ops Dashboard.

## Development

```bash
npm install
npm run test
npm run build
npm run secret-scan
```

Keep changes focused. For schema work, add or update tests in `tests/sync-core.test.js` so maintainers can verify column mapping, malformed rows, and ranking behavior.

## Pull Requests

- Do not commit private Google Sheet IDs, API keys, or real member data.
- Use anonymous fixtures in `src/json` and `samples`.
- Include screenshots for visible dashboard changes.
- Update `CHANGELOG.md` for user-facing changes.

## Data Privacy

Sample data must use synthetic community names, member names, handles, scores, and activity values. If you are adapting a real community sheet, map it locally through `community-dashboard.config.json` and commit only anonymized output.
