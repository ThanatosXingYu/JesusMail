package database_initialization

import (
	"strings"
	"testing"
)

func TestActivationSchemaStatementsCoverUpgradeCompatibility(t *testing.T) {
	migration := strings.Join(activationSchemaStatements(), "\n")
	required := []string{
		"ADD COLUMN IF NOT EXISTS group_name",
		"ADD COLUMN IF NOT EXISTS created_at",
		"activation_keys_id_seq",
		"activation_logs_id_seq",
		"ALTER COLUMN id SET DEFAULT nextval",
		"CREATE UNIQUE INDEX IF NOT EXISTS activation_keys_keycode_key",
		"CREATE INDEX IF NOT EXISTS idx_activation_keys_status",
		"CREATE INDEX IF NOT EXISTS idx_activation_logs_keycode",
	}
	for _, fragment := range required {
		if !strings.Contains(migration, fragment) {
			t.Errorf("activation schema migration missing %q", fragment)
		}
	}
}
