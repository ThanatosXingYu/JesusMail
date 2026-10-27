package database_initialization

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/frame/g"
)

var mailboxMessageIndexSchemaInitializationErr error

func init() {
	registerHandler(func() {
		for _, statement := range mailboxMessageIndexSchemaStatements() {
			if _, err := g.DB().Exec(context.Background(), statement); err != nil {
				mailboxMessageIndexSchemaInitializationErr = fmt.Errorf("initialize mailbox message index: %w", err)
				g.Log().Error(context.Background(), mailboxMessageIndexSchemaInitializationErr)
				return
			}
		}
		mailboxMessageIndexSchemaInitializationErr = nil
	})
}

func MailboxMessageIndexSchemaInitializationError() error {
	return mailboxMessageIndexSchemaInitializationErr
}

func mailboxMessageIndexSchemaStatements() []string {
	return []string{
		`CREATE TABLE IF NOT EXISTS mailbox_message_index (
			id BIGSERIAL PRIMARY KEY,
			mailbox_username VARCHAR(320) NOT NULL,
			direction VARCHAR(16) NOT NULL CHECK (direction IN ('sent', 'received')),
			folder VARCHAR(255) NOT NULL DEFAULT '',
			file_path TEXT NOT NULL UNIQUE,
			message_id TEXT NOT NULL DEFAULT '',
			sender TEXT NOT NULL DEFAULT '',
			recipients TEXT NOT NULL DEFAULT '',
			subject TEXT NOT NULL DEFAULT '',
			sent_at TIMESTAMPTZ NOT NULL,
			body_text TEXT NOT NULL DEFAULT '',
			body_preview TEXT NOT NULL DEFAULT '',
			size_bytes BIGINT NOT NULL DEFAULT 0,
			file_mtime_ns BIGINT NOT NULL DEFAULT 0,
			created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_message_index_mailbox
			ON mailbox_message_index(mailbox_username, sent_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_message_index_direction
			ON mailbox_message_index(direction, sent_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_message_index_sender
			ON mailbox_message_index(LOWER(sender))`,
		`CREATE INDEX IF NOT EXISTS idx_mailbox_message_index_recipients
			ON mailbox_message_index(LOWER(recipients))`,
	}
}
