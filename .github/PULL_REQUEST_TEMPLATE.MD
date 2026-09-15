# JesusMail Pull Request

## Summary

Describe what changed and why it is needed.

## Scope

- [ ] Backend
- [ ] Frontend
- [ ] Mail services or configuration
- [ ] Activation-code workflow
- [ ] Mailbox lifecycle or recycle bin
- [ ] Roundcube or one-click login
- [ ] Documentation or branding only

## Safety checklist

- [ ] I did not rename legacy-compatible runtime identifiers without a migration plan.
- [ ] I did not include passwords, tokens, private keys, customer data, or production dumps.
- [ ] Database and mailbox lifecycle changes are transactional or have a documented recovery strategy.
- [ ] User-visible text and assets use JesusMail branding.
- [ ] I considered rollback and compatibility with existing deployments.

## Validation

List the exact commands and manual flows used to validate this change.

```text
# Example
# go test ./path/to/package
# pnpm test
# bash -n bm.sh install.sh update.sh
```

## User flow tested

Explain the relevant workflow, including activation, mailbox sign-in, sending/receiving, deletion, recycle-bin recovery, or expiration where applicable.

## Screenshots

Attach before/after screenshots for visible UI changes. Redact all private information.

## Rollback

Describe how this change can be reverted safely.

## Additional notes

Document known limitations, follow-up work, and deployment requirements.
