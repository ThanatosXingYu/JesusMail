# Production customization baseline

This directory is a **sanitized, rebranded reference template** of the QLU Mail customizations discovered on the production server on 2026-09-14.

- `custom-auth-site/`: activation page and activation-code management API.
- `jesusmail-overrides/`: JesusMail admin UI and Roundcube skin overrides.
- `server-config/`: Nginx/rewrite/Compose configuration references with server identifiers redacted. These templates do not represent the current running service names or mount points and must be reviewed before use.

Runtime data, database dumps, API tokens, passwords, TLS keys, activation-code archives, and `.env` are intentionally excluded. The original read-only copies are kept under the local Git-ignored `server-private/` directory.

The PHP baseline has been changed only to read secrets from environment variables:

- `BM_API_TOKEN`
- `QLU_MAIL_DB_PASSWORD`

These sanitized files have **not** been deployed to production.
