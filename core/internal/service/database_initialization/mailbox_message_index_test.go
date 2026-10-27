package database_initialization

import (
	"strings"
	"testing"
)

func TestMailboxMessageIndexSchema(t *testing.T) {
	migration := strings.Join(mailboxMessageIndexSchemaStatements(), "\n")
	for _, fragment := range []string{
		"CREATE TABLE IF NOT EXISTS mailbox_message_index",
		"file_path TEXT NOT NULL UNIQUE",
		"body_text TEXT NOT NULL DEFAULT ''",
		"idx_mailbox_message_index_direction",
		"idx_mailbox_message_index_sender",
		"idx_mailbox_message_index_recipients",
	} {
		if !strings.Contains(migration, fragment) {
			t.Errorf("mailbox message migration missing %q", fragment)
		}
	}
}
