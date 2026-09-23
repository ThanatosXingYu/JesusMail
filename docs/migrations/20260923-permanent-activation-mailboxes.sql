-- =============================================================================
-- JesusMail 迁移：所有现存有限期邮箱改为永久有效
-- 日期：2026-09-23
-- 说明：自本版本起，通过激活码开通的邮箱一律为永久有效（不再设置到期时间）。
--       本脚本把 mailbox 表中所有来源且到期时间不为空的现存邮箱修正为永久有效。
--
-- 安全设计：
--   1. 先把所有受影响的行备份到独立迁移记录表，任何时候都可回滚；
--   2. 按用户要求处理 mailbox 表中所有 expires_at 非空的邮箱，包含 activation、manual、
--      batch、import、legacy 等来源；执行前必须确认这符合当前实例的运营策略；
--   3. 脚本可重复执行（幂等），重复执行不会造成数据丢失或重复备份；
--   4. 执行前请确认已经完成一次完整的、可验证的数据库备份。
--
-- 本脚本已经覆盖所有来源；如只想迁移激活来源，请在测试库先增加 source_type 条件。
-- =============================================================================

BEGIN;
LOCK TABLE mailbox IN SHARE ROW EXCLUSIVE MODE; -- 防止备份与更新间发生并发变更

-- -----------------------------------------------------------------------------
-- 步骤 1：创建迁移记录表（若已存在则跳过，保证幂等）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mailbox_expires_at_migration_20260923 (
    username    VARCHAR(255) PRIMARY KEY,  -- 邮箱完整地址，唯一标识一行
    expires_at  TIMESTAMPTZ,              -- 迁移前的到期时间（用于回滚）
    source_type VARCHAR(32),              -- 迁移前的来源类型
    active      INTEGER,                  -- 迁移前的启用状态
    create_time BIGINT,                   -- 邮箱创建时间，回滚时防止同名新邮箱误恢复
    migrated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE mailbox_expires_at_migration_20260923 IS
    'JesusMail 2026-09-23 所有邮箱永久化迁移的原始到期时间备份表';

-- -----------------------------------------------------------------------------
-- 步骤 2：把受影响的行先备份进迁移记录表（幂等：重复执行不会覆盖已有备份）
-- -----------------------------------------------------------------------------
INSERT INTO mailbox_expires_at_migration_20260923 (username, expires_at, source_type, active, create_time)
SELECT username, expires_at, source_type, active, create_time
FROM mailbox
WHERE expires_at IS NOT NULL
ON CONFLICT (username) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 步骤 3：把所有有限期邮箱清空到期时间（NULL 即"永久有效"）
-- -----------------------------------------------------------------------------
UPDATE mailbox
SET expires_at  = NULL,
    update_time = EXTRACT(EPOCH FROM now())::BIGINT
WHERE expires_at IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 步骤 4（校验）：提交前先确认结果，确认无误再执行 COMMIT
--   预期结果：remaining 应为 0
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM mailbox WHERE expires_at IS NOT NULL) THEN
        RAISE EXCEPTION 'mailbox expiry migration incomplete';
    END IF;
END $$;

COMMIT;

-- =============================================================================
-- 回滚脚本（仅在迁移后发现问题、且回收站/归档尚未清理相关邮箱时使用）
-- 回滚会把到期时间恢复为迁移前的值。已被归档进回收站的邮箱不在 mailbox 表中，
-- 需要在 mailbox_recycle_items 中另行处理。
-- =============================================================================
-- BEGIN;
-- UPDATE mailbox m
-- SET expires_at  = b.expires_at,
--     update_time = EXTRACT(EPOCH FROM now())::BIGINT
-- FROM mailbox_expires_at_migration_20260923 b
-- WHERE m.username = b.username
--   AND m.create_time = b.create_time -- 防止邮箱地址被重新使用时误恢复到期时间
--   AND m.expires_at IS NULL;
-- COMMIT;
