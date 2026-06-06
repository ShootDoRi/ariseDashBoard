# ARISE Guild Ranking

ARISE Guild Ranking is an open-source Vue dashboard template for Solo Leveling: ARISE guild maintainers who manage weekly raid rankings through Google Sheets.

Guilds paste a Google Sheet URL, fill columns in this order, and run sync:

```text
아이디, 태그, 점수, 순위
```

The sync command writes the current ranking JSON, recalculates rank from score, and updates weekly score history by matching users on `태그`.

## Features

- Google Sheets URL or sheet ID sync with configurable column mapping.
- Weekly ARISE guild ranking table with ID, tag, score, and calculated rank.
- Tag-matched member detail modal with weekly score history charts.
- Anonymous four-column sample data that can be used without a private sheet.
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

## Sync A Guild Sheet

Copy the examples and fill in your own public or restricted sheet details:

```bash
cp .env.example .env
cp community-dashboard.config.example.json community-dashboard.config.json
npm run sync -- --config community-dashboard.config.json
```

Set these fields in `community-dashboard.config.json`:

```json
{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/{YOUR_ARISE_GUILD_SHEET_ID}/edit",
  "sheetId": "YOUR_ARISE_GUILD_SHEET_ID",
  "range": "Weekly!A2:D",
  "weekLabel": "52주차",
  "outputPath": "src/json/arise/sheet_data.json",
  "historyOutputPath": "src/json/arise/flow/sheet_data_flow_final.json"
}
```

`sheetUrl` is preferred. `sheetId` remains as a fallback for maintainers who only want to paste the spreadsheet ID.

For an offline dry run against anonymous rows:

```bash
npm run sync -- --config community-dashboard.config.example.json --input samples/community-rows.json --dry-run
```

Set `GOOGLE_SHEETS_API_KEY` in your shell or `.env` when syncing from Google Sheets. Restrict the key to the Sheets API and rotate it immediately if it is ever committed.

## Data Model

The ARISE sheet should have four columns:

- `아이디`: display ID, also mapped to internal `순번` and `인게임_닉`.
- `태그`: stable user tag used to match weekly history.
- `점수`: weekly guild raid score, mapped to `길드레이드_점수`.
- `순위`: optional input rank. Sync overwrites internal `Rank` from score.

The UI preserves these internal field keys for compatibility with existing components:

- `순번`: member id
- `인게임_닉`: member id fallback for legacy modal display
- `태그`: user tag
- `길드레이드_점수`: score
- `Rank`: calculated rank

When `weekLabel` and `historyOutputPath` are configured, sync updates `src/json/arise/flow/sheet_data_flow_final.json` by `태그` and preserves older week keys.

## Codex For OSS Use

If accepted for OpenAI Codex OSS support, API credits and Codex Security would be used for PR review, issue triage, release notes, security review, and maintaining safe Google Sheets adapters for ARISE guild workflows. See [docs/codex-for-oss-notes.md](docs/codex-for-oss-notes.md).

## License

MIT
