# Community Ops Dashboard

Community Ops Dashboard is an open-source Vue dashboard template for community maintainers who manage rankings, members, and activity through Google Sheets or exported spreadsheet rows.

The project started as a live community operations dashboard and has been generalized with anonymous sample data, a config-driven sync command, CI, tests, and maintainer docs.

## Features

- Spreadsheet-to-JSON sync with configurable column mapping.
- Member, ranking, score, and activity dashboard views.
- Search, sortable tables, member detail modal, and activity charts.
- Anonymous sample data that can be used without a private sheet.
- Secret scan for Google API keys and hardcoded private sheet identifiers.

## Quick Start

```bash
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:8080`.

## Scripts

```bash
npm run dev          # Start the local dashboard
npm run build        # Build production assets
npm run test         # Run node:test coverage for sync behavior
npm run sync         # Sync configured spreadsheet rows to JSON
npm run secret-scan  # Check for committed Google keys or sheet IDs
```

## Sync A Sheet

Copy the examples and fill in your own public or restricted sheet details:

```bash
cp .env.example .env
cp community-dashboard.config.example.json community-dashboard.config.json
npm run sync -- --config community-dashboard.config.json
```

For an offline dry run against anonymous rows:

```bash
npm run sync -- --config community-dashboard.config.example.json --input samples/community-rows.json --dry-run
```

Set `GOOGLE_SHEETS_API_KEY` in your shell or `.env` when syncing from Google Sheets. Restrict the key to the Sheets API and rotate it immediately if it is ever committed.

## Data Model

The UI currently preserves the original internal field keys for compatibility with the existing components, while the public labels are generic:

- `순번`: member id
- `인게임_닉`: member name
- `태그`: handle
- `직위`: role
- `배틀클래스`: level or segment
- `길드레이드_점수`: score
- `격노`: activity metric
- `Rank`: calculated rank

Use `columnMapping` in `community-dashboard.config.json` to map any spreadsheet schema into those fields.

## Codex For OSS Use

If accepted for OpenAI Codex OSS support, API credits and Codex Security would be used for PR review, issue triage, release notes, security review, and generating spreadsheet adapters for new community schemas. See [docs/codex-for-oss-notes.md](docs/codex-for-oss-notes.md).

## License

MIT
