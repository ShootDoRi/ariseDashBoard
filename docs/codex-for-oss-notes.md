# Codex For OSS Notes

## Repository Qualification

ARISE Guild Ranking is an open-source dashboard template for Solo Leveling: ARISE guild maintainers who manage weekly raid rankings through Google Sheets. It supports Sheet URL sync, four-column input, calculated ranks, tag-matched weekly score history, sample data, CI, docs, and maintainer workflows.

Recent maintenance added privacy-safe Google Sheets import validation for empty rows, missing required fields, invalid scores, and missing column mappings. The dry-run path prints schema warnings with row numbers and field names only, so maintainers can troubleshoot weekly imports without exposing member names, tags, raw scores, private Sheet URLs, API keys, or application identifiers.

## API Credits Use

We will use API credits with Codex for PR review, issue triage, release notes, security review, and generating or maintaining Google Sheets adapters. The expected benefit is faster weekly maintenance for ARISE guild operators while keeping public samples, validation output, and documentation safe for open-source review.

## Evidence To Attach Privately

- Anonymous operating scale, such as number of guild maintainers, ranked users, and weekly views.
- Before-and-after workflow notes showing time saved versus manual spreadsheet review.
- Redacted screenshots or screen recordings that show the dashboard in use without exposing private member data.
- Release and maintenance activity after the public `v0.1.0` tag.
