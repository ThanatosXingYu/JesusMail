-- =============================================================================
-- JesusMail 迁移：激活邮箱改为永久有效
-- 日期：2026-09-23
-- 说明：自本版本起，通过激活码开通的邮箱一律为永久有效（不再设置到期时间）。
--       本脚本用于把数据库中"已经通过激活码开通、但此前被设置了有限到期时间"的
--       历史邮箱一并修正为永久有效。
--
-- 安全设计：
--   1. 先把所有受影响的行备份到独立迁移记录表，任何时候都可回滚；
--   2. 只处理 source_type = 'activation' 的邮箱，不触碰管理员手动创建的邮箱
--      （manual / batch / import / legacy），避免误改人工设定的到期时间；
--   3. 脚本可重复执行（幂等），重复执行不会造成数据丢失或重复备份；
--   4. 执行前请确认已经完成一次完整的、可验证的数据库备份。
--
-- 如需把"所有来源"的有限期邮箱都改成永久（包含管理员手动创建的），
-- 请把下面两处 WHERE source_type = 'activation' 改成你需要的条件，
-- 并先在测试库验证后再到生产执行。
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 步骤 1：创建迁移记录表（若已存在则跳过，保证幂等）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mailbox_expires_at_migration_20260923 (
    username    VARCHAR(255) PRIMARY KEY,  -- 邮箱完整地址，唯一标识一行
    expires_at  TIMESTAMPTZ,              -- 迁移前的到期时间（用于回滚）
    source_type VARCHAR(32),              -- 迁移前的来源类型
    active      INTEGER,                  -- 迁移前的启用状态
    migrated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE mailbox_expires_at_migration_20260923 IS
    'JesusMail 2026-09-23 激活邮箱永久化迁移的备份表，仅在需要回滚时使用';

-- -----------------------------------------------------------------------------
-- 步骤 2：把受影响的行先备份进迁移记录表（幂等：重复执行不会覆盖已有备份）
-- -----------------------------------------------------------------------------
INSERT INTO mailbox_expires_at_migration_20260923 (username, expires_at, source_type, active)
SELECT username, expires_at, source_type, active
FROM mailbox
WHERE source_type = 'activation'
  AND expires_at IS NOT NULL
ON CONFLICT (username) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 步骤 3：把激活来源的有限期邮箱清空到期时间（NULL 即"永久有效"）
-- -----------------------------------------------------------------------------
UPDATE mailbox
SET expires_at  = NULL,
    update_time = EXTRACT(EPOCH FROM now())::BIGINT
WHERE source_type = 'activation'
  AND expires_at IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 步骤 4（校验）：提交前先确认结果，确认无误再执行 COMMIT
--   预期结果：remaining 应为 0
-- -----------------------------------------------------------------------------
-- SELECT COUNT(*) AS remaining
-- FROM mailbox
-- WHERE source_type = 'activation' AND expires_at IS NOT NULL;

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
--   AND m.source_type = 'activation'
--   AND m.expires_at IS NULL;
-- COMMIT;
