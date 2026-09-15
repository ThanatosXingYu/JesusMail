package database_initialization

import (
	"strings"
	"testing"
)

func TestMailboxLifecycleSchemaStatementsCoverMailboxAndRecycleState(t *testing.T) {
	migration := strings.Join(mailboxLifecycleSchemaStatements(), "\n")
	required := []string{
		"ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ",
		"ADD COLUMN IF NOT EXISTS source_type VARCHAR(32) DEFAULT 'legacy'",
		"ADD COLUMN IF NOT EXISTS activation_key_id BIGINT",
		"ALTER COLUMN source_type SET NOT NULL",
		"CREATE TABLE IF NOT EXISTS mailbox_recycle_items",
		"archive_uuid UUID NOT NULL UNIQUE",
		"password VARCHAR(255) NOT NULL",
		"password_encode VARCHAR(255) NOT NULL",
		"original_maildir_path TEXT NOT NULL",
		"archive_path TEXT NOT NULL",
		"purge_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')",
		"activation_keycode_snapshot VARCHAR(32) NOT NULL DEFAULT ''",
		"mailbox_recycle_items_status_check",
		"idx_mailbox_recycle_inflight_username",
	}
	for _, fragment := range required {
		if !strings.Contains(migration, fragment) {
			t.Errorf("mailbox lifecycle migration missing %q", fragment)
		}
	}
}
