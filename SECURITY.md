# Security

## Supported Versions

Security fixes are accepted for the current `main` branch and latest tagged release.

## Reporting A Vulnerability

Open a private security advisory on GitHub if available, or contact the maintainers through the repository owner profile. Do not open a public issue for credentials, private sheet IDs, or real member data exposure.

## Secret Handling

- Never commit `community-dashboard.config.json` if it contains private sheet IDs.
- Never commit `.env`.
- Restrict Google API keys to the Google Sheets API and the minimum required referrers or IPs.
- Rotate any key that was committed, logged, or shared outside the maintainer group.

Run this before opening a PR:

```bash
npm run secret-scan
```
