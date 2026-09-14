# Production customization baseline

This directory is a **sanitized, version-controlled snapshot** of the QLU Mail customizations discovered on the production server on 2026-09-14.

- `custom-auth-site/`: activation page and activation-code management API.
- `billionmail-overrides/`: BillionMail admin UI and Roundcube skin overrides.
- `server-config/`: Nginx/rewrite/Compose configuration snapshots with server identifiers redacted.

Runtime data, database dumps, API tokens, passwords, TLS keys, activation-code archives, and `.env` are intentionally excluded. The original read-only copies are kept under the local Git-ignored `server-private/` directory.

The PHP baseline has been changed only to read secrets from environment variables:

- `BM_API_TOKEN`
- `QLU_MAIL_DB_PASSWORD`

These sanitized files have **not** been deployed to production.
