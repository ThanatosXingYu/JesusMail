package database_initialization

import (
	"context"
	"github.com/gogf/gf/v2/frame/g"
)

func init() {
	registerHandler(func() {
		sqlList := []string{
			`CREATE TABLE IF NOT EXISTS activation_keys (
                id BIGSERIAL PRIMARY KEY,
                keycode VARCHAR(32) NOT NULL UNIQUE,
                status SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0,1,2)),
                used_at TIMESTAMPTZ,
                used_ip VARCHAR(45),
                email VARCHAR(320),
                note VARCHAR(255) NOT NULL DEFAULT '',
                group_name VARCHAR(100) NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
			`CREATE INDEX IF NOT EXISTS idx_activation_keys_status ON activation_keys(status)`,
			`CREATE INDEX IF NOT EXISTS idx_activation_keys_group ON activation_keys(group_name)`,
			`CREATE TABLE IF NOT EXISTS activation_logs (
                id BIGSERIAL PRIMARY KEY,
                keycode VARCHAR(32) NOT NULL,
                email VARCHAR(320) NOT NULL,
                ip VARCHAR(45),
                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
			`CREATE INDEX IF NOT EXISTS idx_activation_logs_keycode ON activation_logs(keycode)`,
		}
		for _, sql := range sqlList {
			if _, err := g.DB().Exec(context.Background(), sql); err != nil {
				g.Log().Error(context.Background(), "Failed to initialize activation tables:", err)
				return
			}
		}
	})
}
