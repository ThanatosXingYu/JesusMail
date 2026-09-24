<div align="center">
  <a name="readme-top"></a>
  <h1>JesusMail 📧</h1>
  <p><strong>Self-hosted mail operations and distribution platform</strong></p>
  <p>Version 1.0.0</p>

[简体中文](README.md) | English | [日本語](README-ja.md) | [Türkçe](README-tr.md)
</div>

## What is JesusMail?

JesusMail combines a mail server, webmail, mailbox administration, activation-code delivery, and email campaign tools in one self-hosted system. It is designed for operators who distribute managed mailboxes through marketplaces, private sales channels, or reseller workflows while retaining control of account lifecycle and data.

## Main capabilities

- Mailbox and domain administration, with per-mailbox successful sent/received log-record counts
- Activation-code creation, grouping, export, binding reset, and redemption
- Public mailbox activation with permanent (non-expiring) mailboxes
- One-click sign-in to the corresponding webmail account
- Mailbox recycle bin with a 30-day retention period
- Campaigns, contacts, templates, delivery analytics, and warm-up tools
- Integrated Roundcube webmail
- Docker Compose deployment with PostgreSQL, Redis, Postfix, Dovecot, and Rspamd

## Mailbox traffic counters

The mailbox table shows successful sent/received records for each address on the current page (`status = sent`, DSN `2.x`). Counts come from retained Postfix log tables, **not lifetime totals or current mailbox contents**: pruning decreases them, and the latest-record-per-queue-ID model can undercount multi-recipient deliveries. If statistics fail, the mailbox list remains available and displays zero for that request; check the service log before interpreting zero as a complete audit result. Login information has a copy button; one-click login is in the Actions column.

## Distribution workflow

A typical reseller flow is:

1. Create one or more activation codes in the JesusMail administrator console.
2. Deliver a code to the customer through the selected sales channel.
3. The customer opens the public activation page, selects an available mailbox name and redeems the code (the mailbox is permanent and never expires).
4. The administrator can review the code binding, mailbox source, and expiration date.
5. The mailbox owner can use the provided credentials or the administrator can use one-click sign-in for support.
6. Clearing a code binding removes the affected mailbox through the recycle-bin lifecycle and returns the code to an unused state.

## Requirements

- A Linux server with Docker Engine and Docker Compose v2
- A public domain with correct MX, SPF, DKIM, and DMARC records
- Open mail and management ports required by your deployment
- A complete backup before installing or upgrading a production instance

## Install from an existing checkout

The public repository URL for this customized edition is intentionally not hard-coded in the documentation. Obtain the JesusMail source from your authorized distribution channel, then run:

```shell
cd /path/to/JesusMail
cp env_init .env
# Review every value in .env before starting services.
docker compose up -d
```

Alternatively, use the installation script after reviewing its configuration and compatibility behavior:

```shell
cd /path/to/JesusMail
bash install.sh
```

> Do not run an update directly against a production instance without a verified database, configuration, and mail-data backup.

## Management commands

```shell
bm help          # Show available commands
bm default       # Show administrator access information
bm show-record   # Show required DNS records
bm status        # Show container status
bm restart       # Restart JesusMail services
```

Some internal service names, paths, database names, and environment variables retain legacy-compatible identifiers. They are implementation details required for safe upgrades and existing deployments; they do not represent the JesusMail product name.

## Data migration

Activated mailboxes are permanent (`expires_at` is empty). To convert existing
mailboxes of every source that were previously given a finite expiry into
permanent ones, run the reversible migration:

```text
docs/migrations/20260923-permanent-activation-mailboxes.sql
```

It backs up affected rows before updating, covers all existing `mailbox` rows with non-null `expires_at`, is idempotent, and ships with a rollback script. See
[docs/REVERSE_PROXY.md](docs/REVERSE_PROXY.md) for proxy setup.

## Webmail

Roundcube is integrated and is normally available under `/roundcube/`. JesusMail can issue a short-lived, single-use sign-in ticket so an authorized administrator can open a mailbox without placing its password in the browser URL.

## Production safety

Before changing a production deployment, back up at least:

- PostgreSQL data with a consistent database dump
- Maildir data
- Redis and other required persistent service data
- `.env`, Compose files, and the complete `conf/` directory
- Reverse-proxy and TLS configuration
- Current image IDs, tags, and container inspection data

Never use volume-destructive Compose commands or cleanup commands unless the recovery plan has been tested.

## Contributing and support

Use this repository's issue and pull-request templates when reporting a problem or proposing a change. Do not include passwords, activation codes, API tokens, private keys, customer addresses, or production database content.

## License

JesusMail is distributed under the [GNU Affero General Public License v3.0](LICENSE). Third-party components retain their respective licenses and notices.
