package database_initialization

import (
	"strings"
	"testing"
)

func TestActivationWelcomeSchemaStatements(t *testing.T) {
	migration := strings.Join(activationWelcomeSchemaStatements(), "\n")
	required := []string{
		"CREATE TABLE IF NOT EXISTS activation_welcome_jobs",
		"email VARCHAR(320) NOT NULL UNIQUE",
		"status VARCHAR(16) NOT NULL DEFAULT 'pending'",
		"retry_count SMALLINT NOT NULL DEFAULT 0",
		"next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP",
		"last_error TEXT NOT NULL DEFAULT ''",
		"created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP",
		"sent_at TIMESTAMPTZ",
		"idx_activation_welcome_jobs_due",
		"('activation_welcome_enabled', 'true')",
		"('activation_welcome_sender', '')",
		"('activation_welcome_subject', '您的 JesusMail 邮箱已成功激活')",
		"ON CONFLICT (name) DO NOTHING",
	}
	for _, fragment := range required {
		if !strings.Contains(migration, fragment) {
			t.Errorf("activation welcome schema migration missing %q", fragment)
		}
	}
}
