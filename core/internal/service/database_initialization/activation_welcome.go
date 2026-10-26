package database_initialization

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

var activationWelcomeSchemaInitializationErr error

func init() {
	registerHandler(func() {
		activationWelcomeSchemaInitializationErr = initializeActivationWelcomeSchema(context.Background())
		if activationWelcomeSchemaInitializationErr != nil {
			g.Log().Error(context.Background(), "Failed to initialize activation welcome tables:", activationWelcomeSchemaInitializationErr)
		}
	})
}

// ActivationWelcomeSchemaInitializationError reports activation welcome schema failures to startup.
func ActivationWelcomeSchemaInitializationError() error {
	return activationWelcomeSchemaInitializationErr
}

func initializeActivationWelcomeSchema(ctx context.Context) error {
	return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		for index, statement := range activationWelcomeSchemaStatements() {
			if _, err := tx.Exec(statement); err != nil {
				return fmt.Errorf("execute activation welcome schema migration statement %d: %w", index+1, err)
			}
		}
		return nil
	})
}

func activationWelcomeSchemaStatements() []string {
	return []string{
		`CREATE TABLE IF NOT EXISTS bm_options (
            name VARCHAR(255) NOT NULL PRIMARY KEY,
            value TEXT NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS activation_welcome_jobs (
            id BIGSERIAL PRIMARY KEY,
            email VARCHAR(320) NOT NULL UNIQUE,
            status VARCHAR(16) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'sent', 'failed')),
            retry_count SMALLINT NOT NULL DEFAULT 0,
            next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_error TEXT NOT NULL DEFAULT '',
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            sent_at TIMESTAMPTZ
        )`,
		`CREATE INDEX IF NOT EXISTS idx_activation_welcome_jobs_due
            ON activation_welcome_jobs(status, next_attempt_at)`,
		`INSERT INTO bm_options(name, value) VALUES
            ('activation_welcome_enabled', 'true'),
            ('activation_welcome_sender', ''),
            ('activation_welcome_subject', '您的 JesusMail 邮箱已成功激活')
        ON CONFLICT (name) DO NOTHING`,
	}
}
