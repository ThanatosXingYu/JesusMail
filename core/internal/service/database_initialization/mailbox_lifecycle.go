package database_initialization

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

var mailboxLifecycleSchemaInitializationErr error

func initializeMailboxLifecycleSchema(ctx context.Context) error {
	return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		for index, statement := range mailboxLifecycleSchemaStatements() {
			if _, err := tx.Exec(statement); err != nil {
				return fmt.Errorf("execute mailbox lifecycle migration statement %d: %w", index+1, err)
			}
		}
		return nil
	})
}

func mailboxLifecycleSchemaStatements() []string {
	return []string{
		`ALTER TABLE mailbox
			ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
			ADD COLUMN IF NOT EXISTS source_type VARCHAR(32) DEFAULT 'legacy',
			ADD COLUMN IF NOT EXISTS activation_key_id BIGINT`,
		`UPDATE mailbox SET source_type = 'legacy' WHERE source_type IS NULL OR BTRIM(source_type) = ''`,
		`ALTER TABLE mailbox
			ALTER COLUMN source_type SET DEFAULT 'legacy',
			ALTER COLUMN source_type SET NOT NULL`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_expires_at ON mailbox(expires_at) WHERE expires_at IS NOT NULL`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_activation_key_id ON mailbox(activation_key_id) WHERE activation_key_id IS NOT NULL`,
		`CREATE TABLE IF NOT EXISTS mailbox_recycle_items (
			id BIGSERIAL PRIMARY KEY,
			archive_uuid UUID NOT NULL UNIQUE,

			username VARCHAR(255) NOT NULL,
			password VARCHAR(255) NOT NULL,
			password_encode VARCHAR(255) NOT NULL,
			full_name VARCHAR(255) NOT NULL,
			is_admin SMALLINT NOT NULL DEFAULT 0,
			maildir VARCHAR(255) NOT NULL,
			quota BIGINT NOT NULL DEFAULT 0,
			local_part VARCHAR(255) NOT NULL,
			domain VARCHAR(255) NOT NULL,
			create_time INT NOT NULL DEFAULT 0,
			update_time INT NOT NULL DEFAULT 0,
			active SMALLINT NOT NULL DEFAULT 1,
			used_quota BIGINT NOT NULL DEFAULT 0,
			quota_active SMALLINT NOT NULL DEFAULT 1,
			expires_at TIMESTAMPTZ,
			source_type VARCHAR(32) NOT NULL DEFAULT 'legacy',
			activation_key_id BIGINT,

			related_activation_key_id BIGINT,
			activation_keycode_snapshot VARCHAR(32) NOT NULL DEFAULT '',
			original_maildir_path TEXT NOT NULL,
			archive_path TEXT NOT NULL,
			mail_size_bytes BIGINT NOT NULL DEFAULT 0,
			file_count BIGINT NOT NULL DEFAULT 0,
			archive_status VARCHAR(32) NOT NULL DEFAULT 'pending',
			deleted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			purge_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
			delete_reason VARCHAR(64) NOT NULL DEFAULT 'manual_delete',
			delete_source VARCHAR(32) NOT NULL DEFAULT 'admin',
			last_error TEXT NOT NULL DEFAULT '',
			status_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			restored_at TIMESTAMPTZ
		)`,
		`DO $$
		BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conrelid = 'mailbox_recycle_items'::regclass
				  AND conname = 'mailbox_recycle_items_status_check'
			) THEN
				ALTER TABLE mailbox_recycle_items
					ADD CONSTRAINT mailbox_recycle_items_status_check
					CHECK (archive_status IN (
						'pending','archiving','archived','archive_failed',
						'restoring','restore_failed','purging','purge_failed'
					));
			END IF;
		END $$`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_recycle_status ON mailbox_recycle_items(archive_status)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_recycle_purge_at ON mailbox_recycle_items(purge_at)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_recycle_username ON mailbox_recycle_items(username)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_recycle_activation_key_id ON mailbox_recycle_items(related_activation_key_id) WHERE related_activation_key_id IS NOT NULL`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_recycle_deleted_at ON mailbox_recycle_items(deleted_at DESC)`,
		`CREATE UNIQUE INDEX IF NOT EXISTS idx_mailbox_recycle_inflight_username
			ON mailbox_recycle_items(username)
			WHERE archive_status IN ('pending','archiving','restoring','purging')`,
	}
}
