# JesusMail 1.0.0 Distribution Launch Plan

**Document date:** September 15, 2026
**Scope:** JesusMail administrator console, public activation flow, Roundcube integration, mailbox lifecycle, and distribution operations.

## 1. Launch objective

Release JesusMail as a self-hosted mailbox distribution platform suitable for direct sales and reseller workflows. The launch must preserve existing production data, provide a tested rollback path, and verify the complete flow from activation-code creation through mailbox activation, sign-in, expiration, deletion, and recovery.

## 2. Release scope

### Included

- JesusMail product naming and blue visual identity
- Activation-code administration and public redemption
- Configurable mailbox expiration dates
- Secure one-click Roundcube sign-in
- Mailbox recycle bin with a default 30-day retention period
- Code binding reset with affected mailbox cleanup
- Mailbox/domain/campaign/contact functionality already supported by the system

### Excluded

- Mechanical renaming of legacy-compatible container services, paths, database names, route segments, Go modules, or environment variables
- Destructive migration of existing mail data
- Unreviewed replacement of production Compose files
- Changes to historical backups or private baseline snapshots

## 3. Release gates

The release cannot proceed until all gates pass.

### Code and configuration

- [ ] Targeted Go tests pass
- [ ] Frontend lint, unit tests, and production build pass
- [ ] Shell scripts pass `bash -n`
- [ ] PHP extensions pass `php -l`
- [ ] Compose configuration parses successfully
- [ ] `git diff --check` reports no whitespace errors
- [ ] User-visible brand audit contains no retired project links or descriptions
- [ ] Remaining historical identifiers are documented as internal compatibility contracts

### Lifecycle and security

- [ ] CLI deletion paths cannot bypass the mailbox recycle-bin service
- [ ] Concurrent archive/restore operations are protected
- [ ] Stale intermediate lifecycle states can be reconciled
- [ ] Mailbox updates cannot race with archive finalization
- [ ] Activation-code reset and mailbox archival have a retryable consistency strategy
- [ ] Mailbox list, export, and operation logs do not expose plaintext or reversibly encoded passwords by default
- [ ] One-click login tickets expire quickly and can be consumed only once

### Deployment readiness

- [ ] Core and Dovecot can access the same Maildir data directory where required by recycle-bin operations
- [ ] Roundcube plugin mount and shared secret are configured
- [ ] Current image IDs, tags, Compose files, `.env`, and container inspection data are recorded
- [ ] Available disk space is checked before backup and image build
- [ ] A restore procedure is written and tested against the release backup structure

## 4. Pre-release backup

Create a new timestamped backup directory without touching earlier backups. It must contain:

- Consistent PostgreSQL dump
- Maildir data
- Required Redis, Postfix, Rspamd, and Roundcube persistent data
- `.env`, Compose files, and the full `conf/` directory
- Reverse-proxy and TLS configuration
- Custom activation-site snapshot, if still present alongside the native flow
- Container inspection output and image IDs/tags
- SHA-256 checksums
- Restore script and operator instructions

Record the backup size and verify that each required file is readable before deployment.

## 5. Deployment sequence

1. Freeze administrative data changes for the short deployment window.
2. Create and verify the new release backup.
3. Build versioned JesusMail images; do not overwrite the rollback tags.
4. Apply only the required Compose mount and environment changes.
5. Replace only affected services in dependency-safe order.
6. Wait for service health and check restart counts after every replacement.
7. Do not use full-stack shutdown, volume deletion, or global Docker cleanup commands.
8. Stop immediately and roll back if database migrations, Maildir access, authentication, or health checks fail.

## 6. End-to-end acceptance test

Use a uniquely named temporary activation code and mailbox.

1. Sign in to the JesusMail administrator console.
2. Create a temporary activation code with a short test validity period.
3. Redeem it through the public activation page.
4. Confirm mailbox source, code binding, status, quota, and expiration date.
5. Confirm normal mailbox credentials work in Roundcube.
6. Use administrator one-click login and verify that the ticket works once only.
7. Send and receive a test message and confirm it is present in Maildir.
8. Clear the activation-code binding.
9. Confirm the code returns to unused state and the mailbox enters the recycle bin.
10. Confirm password metadata, source, expiration, and archived mail usage are represented correctly.
11. Restore the mailbox and confirm messages remain available.
12. Delete it again, permanently purge the temporary recycle item, and remove the temporary code.
13. Verify no temporary database rows, files, sessions, or messages remain.

## 7. Post-release verification

- [ ] Administrator dashboard loads without abnormal delay
- [ ] Mailbox, activation-code, and recycle-bin pages load
- [ ] Public activation and Roundcube pages load over the intended domains
- [ ] SMTP, IMAP, and webmail authentication work
- [ ] Mail sending, receiving, tracking, and campaign basics work
- [ ] No service has an unexpected restart count
- [ ] Error logs show no migration, permission, ticket, or Maildir failures
- [ ] Backup and rollback artifacts remain unchanged and accessible

## 8. Rollback criteria

Rollback if any of the following occurs:

- Administrator or public activation login is unavailable
- Mail delivery or mailbox authentication fails
- Database migration cannot complete safely
- Core cannot archive or restore the actual Maildir
- One-click login leaks credentials or permits ticket replay
- Activation-code state diverges from mailbox state
- A container repeatedly restarts or health checks remain unhealthy

Rollback uses the versioned pre-release images and the new release backup. Historical backups remain read-only emergency references.

## 9. Release record

After successful acceptance, record:

- JesusMail version and build timestamp
- Git revision
- Image tags and image IDs
- Migration versions
- Backup path and checksum manifest
- Acceptance-test identifiers and cleanup result
- Container health and restart-count snapshot
- Known limitations and follow-up work
