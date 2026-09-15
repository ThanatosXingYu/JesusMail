# JesusMail

JesusMail is a self-hosted mail operations and distribution platform. It combines mailbox and domain administration, activation-code delivery, mailbox lifecycle controls, Roundcube webmail, campaign management, contact management, warm-up, and delivery analytics.

## Project structure

```text
core/
├── internal/
│   ├── cmd/            # CLI entry points
│   ├── controller/     # HTTP handlers
│   ├── service/        # Business logic
│   ├── dao/            # Data access layer
│   ├── model/entity/   # ORM entities
│   └── consts/         # Constants
├── api/                # API route definitions
├── frontend/src/
│   ├── views/          # Page components
│   ├── components/     # Reusable UI components
│   ├── store/          # Pinia stores
│   ├── api/modules/    # API clients
│   ├── router/         # Vue Router modules
│   ├── hooks/          # Composables
│   ├── utils/          # Shared utilities
│   ├── features/       # Feature-specific components
│   └── i18n/           # Translations
├── template/           # Email templates
└── manifest/           # Application configuration and deployment assets
conf/                   # Postfix, Dovecot, Rspamd, Redis, and webmail configuration
Dockerfiles/            # Container definitions
```

## Technology stack

- **Backend:** Go 1.22, GoFrame v2, PostgreSQL, Redis
- **Frontend:** Vue 3, TypeScript, Pinia, Naive UI, Vitest, pnpm
- **Mail:** Postfix, Dovecot, Rspamd, Roundcube
- **Deployment:** Docker Compose

## Product rules

- The public product name is **JesusMail**.
- The distribution workflow must preserve activation-code state, mailbox source, expiration date, and auditability.
- Mailbox removal must use the recycle-bin lifecycle rather than direct database deletion.
- One-click webmail login must use a short-lived, single-use server-side ticket; never place a mailbox password in a URL.
- User-facing text, documentation, icons, and colors must follow JesusMail branding.
- Legacy-compatible service names, filesystem paths, database names, module names, route segments, and environment variables must not be mechanically renamed. They remain until a separately planned migration provides backward compatibility and rollback coverage.

## Organization rules

- Controllers: `core/internal/controller/<domain>/`
- Services: `core/internal/service/<domain>/`
- API definitions: `core/api/<domain>/`
- Frontend views: `core/frontend/src/views/<feature>/`
- Tests live next to source files as `*_test.go` or `*.test.ts`
- Keep files focused and preserve the existing project style

## Quality checks

After editing Go code:

```shell
cd core
gofmt -w <changed-go-files>
go test ./path/to/changed/packages
```

After editing frontend code:

```shell
cd core/frontend
pnpm run lint
pnpm test
pnpm run build
```

After editing shell scripts:

```shell
bash -n bm.sh install.sh update.sh
```

Before any release:

```shell
git diff --check
docker compose config --no-interpolate --quiet
```

Fix errors introduced by the current change. If a full-suite failure is a known baseline issue, document it explicitly rather than hiding it.

## Production safety

- Never modify production or a backup when the task is explicitly local-only.
- Never overwrite historical backup directories.
- Never run destructive Docker cleanup or volume-removal commands without an approved and tested recovery plan.
- Create a fresh, verified backup before database migrations, image replacement, or mail-data lifecycle changes.
- Prefer rolling replacement of only the affected service and verify health, logs, restart counts, and the complete user flow afterward.

## Known implementation boundary

Internal compatibility identifiers may still contain historical names. Treat those identifiers as runtime contracts. A branding task may change documentation, comments, and user-visible output, but must not rename those contracts unless the task explicitly includes a migration plan.
