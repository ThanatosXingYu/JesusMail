package database_initialization

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/frame/g"
)

var mailboxUserEventsSchemaInitializationErr error

func init() {
	registerHandler(func() {
		sqlList := []string{
			`-- Mailbox user activity events
			CREATE TABLE IF NOT EXISTS mailbox_user_events (
				id BIGSERIAL PRIMARY KEY,
				username VARCHAR(320) NOT NULL,
				event_type VARCHAR(16) NOT NULL CHECK (event_type IN ('login', 'logout')),
				ip VARCHAR(64) NOT NULL DEFAULT 'unknown',
				user_agent TEXT NOT NULL DEFAULT '',
				detail TEXT NOT NULL DEFAULT '',
				created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
			)`,
			`CREATE INDEX IF NOT EXISTS idx_mailbox_user_events_time ON mailbox_user_events(created_at DESC)`,
			`CREATE INDEX IF NOT EXISTS idx_mailbox_user_events_username_time ON mailbox_user_events(LOWER(username), created_at DESC)`,
			`CREATE INDEX IF NOT EXISTS idx_mailbox_user_events_type_time ON mailbox_user_events(event_type, created_at DESC)`,
		}

		for _, sql := range sqlList {
			if _, err := g.DB().Exec(context.Background(), sql); err != nil {
				g.Log().Error(context.Background(), "Failed to create mailbox user event table:", err)
				mailboxUserEventsSchemaInitializationErr = fmt.Errorf("create mailbox user event schema: %w", err)
				return
			}
		}
		mailboxUserEventsSchemaInitializationErr = nil
	})
}

// MailboxUserEventsSchemaInitializationError reports user-log schema failures to startup.
func MailboxUserEventsSchemaInitializationError() error {
	return mailboxUserEventsSchemaInitializationErr
}
