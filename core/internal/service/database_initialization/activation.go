package database_initialization

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

var activationSchemaInitializationErr error

func init() {
	registerHandler(func() {
		activationSchemaInitializationErr = initializeActivationSchema(context.Background())
		if activationSchemaInitializationErr != nil {
			g.Log().Error(context.Background(), "Failed to initialize activation tables:", activationSchemaInitializationErr)
		}
	})
}

// ActivationSchemaInitializationError reports activation schema failures to the startup command.
func ActivationSchemaInitializationError() error {
	return activationSchemaInitializationErr
}

func initializeActivationSchema(ctx context.Context) error {
	return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		for index, statement := range activationSchemaStatements() {
			if _, err := tx.Exec(statement); err != nil {
				return fmt.Errorf("execute activation schema migration statement %d: %w", index+1, err)
			}
		}
		return nil
	})
}

func activationSchemaStatements() []string {
	return []string{
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
		`ALTER TABLE activation_keys
            ADD COLUMN IF NOT EXISTS id BIGINT,
            ADD COLUMN IF NOT EXISTS keycode VARCHAR(32),
            ADD COLUMN IF NOT EXISTS status SMALLINT DEFAULT 0,
            ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS used_ip VARCHAR(45),
            ADD COLUMN IF NOT EXISTS email VARCHAR(320),
            ADD COLUMN IF NOT EXISTS note VARCHAR(255) DEFAULT '',
            ADD COLUMN IF NOT EXISTS group_name VARCHAR(100) DEFAULT '',
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`,
		`CREATE SEQUENCE IF NOT EXISTS activation_keys_id_seq`,
		`ALTER SEQUENCE activation_keys_id_seq OWNED BY activation_keys.id`,
		`ALTER TABLE activation_keys ALTER COLUMN id SET DEFAULT nextval('activation_keys_id_seq')`,
		`DO $$
        DECLARE max_id BIGINT;
        BEGIN
            SELECT MAX(id) INTO max_id FROM activation_keys WHERE id IS NOT NULL;
            IF max_id IS NULL THEN
                PERFORM setval('activation_keys_id_seq', 1, false);
            ELSE
                PERFORM setval('activation_keys_id_seq', max_id, true);
            END IF;
            UPDATE activation_keys SET id = nextval('activation_keys_id_seq') WHERE id IS NULL;
            SELECT MAX(id) INTO max_id FROM activation_keys;
            IF max_id IS NULL THEN
                PERFORM setval('activation_keys_id_seq', 1, false);
            ELSE
                PERFORM setval('activation_keys_id_seq', max_id, true);
            END IF;
        END $$`,
		`UPDATE activation_keys SET status = 0 WHERE status IS NULL`,
		`UPDATE activation_keys SET note = '' WHERE note IS NULL`,
		`UPDATE activation_keys SET group_name = '' WHERE group_name IS NULL`,
		`UPDATE activation_keys SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`,
		`ALTER TABLE activation_keys
            ALTER COLUMN id SET NOT NULL,
            ALTER COLUMN keycode SET NOT NULL,
            ALTER COLUMN status SET DEFAULT 0,
            ALTER COLUMN status SET NOT NULL,
            ALTER COLUMN note SET DEFAULT '',
            ALTER COLUMN note SET NOT NULL,
            ALTER COLUMN group_name SET DEFAULT '',
            ALTER COLUMN group_name SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN created_at SET NOT NULL`,
		`DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conrelid = 'activation_keys'::regclass AND contype = 'p'
            ) THEN
                ALTER TABLE activation_keys ADD CONSTRAINT activation_keys_pkey PRIMARY KEY (id);
            END IF;
        END $$`,
		`DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conrelid = 'activation_keys'::regclass
                  AND conname = 'activation_keys_status_check'
            ) THEN
                ALTER TABLE activation_keys
                    ADD CONSTRAINT activation_keys_status_check CHECK (status IN (0,1,2));
            END IF;
        END $$`,
		`CREATE UNIQUE INDEX IF NOT EXISTS activation_keys_keycode_key ON activation_keys(keycode)`,
		`CREATE INDEX IF NOT EXISTS idx_activation_keys_status ON activation_keys(status)`,
		`CREATE INDEX IF NOT EXISTS idx_activation_keys_group ON activation_keys(group_name)`,
		`CREATE TABLE IF NOT EXISTS activation_logs (
            id BIGSERIAL PRIMARY KEY,
            keycode VARCHAR(32) NOT NULL,
            email VARCHAR(320) NOT NULL,
            ip VARCHAR(45),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
		`ALTER TABLE activation_logs
            ADD COLUMN IF NOT EXISTS id BIGINT,
            ADD COLUMN IF NOT EXISTS keycode VARCHAR(32),
            ADD COLUMN IF NOT EXISTS email VARCHAR(320),
            ADD COLUMN IF NOT EXISTS ip VARCHAR(45),
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`,
		`CREATE SEQUENCE IF NOT EXISTS activation_logs_id_seq`,
		`ALTER SEQUENCE activation_logs_id_seq OWNED BY activation_logs.id`,
		`ALTER TABLE activation_logs ALTER COLUMN id SET DEFAULT nextval('activation_logs_id_seq')`,
		`DO $$
        DECLARE max_id BIGINT;
        BEGIN
            SELECT MAX(id) INTO max_id FROM activation_logs WHERE id IS NOT NULL;
            IF max_id IS NULL THEN
                PERFORM setval('activation_logs_id_seq', 1, false);
            ELSE
                PERFORM setval('activation_logs_id_seq', max_id, true);
            END IF;
            UPDATE activation_logs SET id = nextval('activation_logs_id_seq') WHERE id IS NULL;
            SELECT MAX(id) INTO max_id FROM activation_logs;
            IF max_id IS NULL THEN
                PERFORM setval('activation_logs_id_seq', 1, false);
            ELSE
                PERFORM setval('activation_logs_id_seq', max_id, true);
            END IF;
        END $$`,
		`UPDATE activation_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`,
		`ALTER TABLE activation_logs
            ALTER COLUMN id SET NOT NULL,
            ALTER COLUMN keycode SET NOT NULL,
            ALTER COLUMN email SET NOT NULL,
            ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN created_at SET NOT NULL`,
		`DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conrelid = 'activation_logs'::regclass AND contype = 'p'
            ) THEN
                ALTER TABLE activation_logs ADD CONSTRAINT activation_logs_pkey PRIMARY KEY (id);
            END IF;
        END $$`,
		`CREATE INDEX IF NOT EXISTS idx_activation_logs_keycode ON activation_logs(keycode)`,
	}
}
