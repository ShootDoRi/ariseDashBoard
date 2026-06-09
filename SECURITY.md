# Security

## Supported Versions

Security fixes are accepted for the current `main` branch and latest tagged release.

## Reporting A Vulnerability

Open a private security advisory on GitHub if available, or contact the maintainers through the repository owner profile.

Do not open a public issue for:

- Google Sheets URLs, private sheet IDs, or Google API keys.
- `.env` contents or local `community-dashboard.config.json` values.
- Raw member names, tags, scores, weekly history exports, screenshots, or recordings that expose real operating data.
- Account identifiers, personal contact details, or application/submission identifiers.

Public issues are appropriate for reproducible bugs that use anonymous sample data, generated fixtures, or redacted screenshots. Send suspected credential exposure, private configuration leaks, or real member data exposure through a private advisory or private maintainer contact instead.

## Secret Handling

- Never commit `.env`, `.env.*`, or `community-dashboard.config.json` when they contain private Sheet URLs, sheet IDs, API keys, ranges, or maintainer-only configuration.
- Keep real Google Sheets URLs and raw member data outside the public repository. Use anonymous sample rows and redacted screenshots for docs, issues, demos, and releases.
- Restrict Google API keys to the Google Sheets API and the minimum required referrers or IPs.
- Rotate any key that was committed, logged, screenshotted, or shared outside the maintainer group.
- Treat sync warnings and errors as public output: they should include row numbers and field names only, not member names, tags, raw scores, URLs, keys, or application identifiers.

Follow the recurring weekly sync and release process in `docs/maintainer-workflow.md`. This file only defines security and privacy rules for public reporting and repository content.

Run this before opening a PR:

```bash
npm run secret-scan
```
