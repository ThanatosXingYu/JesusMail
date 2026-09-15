<div align="center">
  <a name="readme-top"></a>
  <h1>JesusMail 📧</h1>
  <p><strong>Self-hosted mail operations and distribution platform</strong></p>
  <p>Version 1.0.0</p>

English | [简体中文](README-zh_CN.md) | [日本語](README-ja.md) | [Türkçe](README-tr.md)
</div>

## What is JesusMail?

JesusMail combines a mail server, webmail, mailbox administration, activation-code delivery, and email campaign tools in one self-hosted system. It is designed for operators who distribute managed mailboxes through marketplaces, private sales channels, or reseller workflows while retaining control of account lifecycle and data.

## Main capabilities

- Mailbox and domain administration
- Activation-code creation, grouping, export, binding reset, and redemption
- Public mailbox activation with configurable expiration dates
- One-click sign-in to the corresponding webmail account
- Mailbox recycle bin with a default 30-day retention period
- Campaigns, contacts, templates, delivery analytics, and warm-up tools
- Integrated Roundcube webmail
- Docker Compose deployment with PostgreSQL, Redis, Postfix, Dovecot, and Rspamd

## Distribution workflow

A typical reseller flow is:

1. Create one or more activation codes in the JesusMail administrator console.
2. Deliver a code to the customer through the selected sales channel.
3. The customer opens the public activation page, selects an available mailbox name and validity period, and redeems the code.
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
