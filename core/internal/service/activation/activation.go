package activation

import (
	mailboxv1 "billionmail-core/api/mail_boxes/v1"
	"billionmail-core/internal/service/mail_boxes"
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gogf/gf/v2/container/gvar"
	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

const defaultDomain = "mail.qlu.edu.kg"
const defaultQuota int64 = 33554432

const activationRateLimitPrefix = "JESUSMAIL_ACTIVATE_RATE:"
const legacyActivationRateLimitPrefix = "JESSUSMAIL_ACTIVATE_RATE:"

const activationRateLimitScript = `
local current = redis.call("GET", KEYS[1])
if not current then
    local legacy = redis.call("GET", KEYS[2])
    if legacy then
        local ttl = redis.call("TTL", KEYS[2])
        if ttl < 1 then
            ttl = ARGV[1]
        end
        redis.call("SET", KEYS[1], legacy, "EX", ttl)
        redis.call("DEL", KEYS[2])
        current = legacy
    else
        redis.call("SET", KEYS[1], 1, "EX", ARGV[1])
        return 1
    end
end

local count = redis.call("INCR", KEYS[1])
if redis.call("TTL", KEYS[1]) < 0 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return count
`

type redisScriptEvaluator interface {
	Eval(ctx context.Context, script string, numKeys int64, keys []string, args []any) (*gvar.Var, error)
}

var (
	keyPattern       = regexp.MustCompile(`^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$`)
	prefixPattern    = regexp.MustCompile(`^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$`)
	passwordLetter   = regexp.MustCompile(`[A-Za-z]`)
	passwordDigit    = regexp.MustCompile(`[0-9]`)
	reservedPrefixes = map[string]struct{}{
		"admin": {}, "administrator": {}, "root": {}, "abuse": {}, "postmaster": {},
		"webmaster": {}, "hostmaster": {}, "mailer-daemon": {}, "noreply": {}, "no-reply": {},
		"support": {}, "info": {}, "billing": {}, "contact": {}, "security": {},
		"billion": {}, "mail": {}, "test": {}, "activate": {},
	}
)

var (
	ErrInvalidKey    = errors.New("该激活密钥无效或已被使用")
	ErrMailboxExists = errors.New("该邮箱前缀已被占用，请换一个")
)

type Key struct {
	Id        int64      `json:"id"`
	Keycode   string     `json:"keycode"`
	Status    int        `json:"status"`
	UsedAt    *time.Time `json:"used_at"`
	UsedIp    string     `json:"used_ip"`
	Email     string     `json:"email"`
	Note      string     `json:"note"`
	GroupName string     `json:"group_name"`
	CreatedAt time.Time  `json:"created_at"`
}

type Stats struct {
	Total    int `json:"total"`
	Unused   int `json:"unused"`
	Used     int `json:"used"`
	Disabled int `json:"disabled"`
}

type ListResult struct {
	Total    int      `json:"total"`
	Page     int      `json:"page"`
	PageSize int      `json:"page_size"`
	Groups   []string `json:"groups"`
	List     []Key    `json:"list"`
}

func activationEnv(primary, legacy string) string {
	if value := strings.TrimSpace(os.Getenv(primary)); value != "" {
		return value
	}
	return strings.TrimSpace(os.Getenv(legacy))
}

func Domain() string {
	if value := activationEnv("JESUSMAIL_ACTIVATION_DOMAIN", "JESSUSMAIL_ACTIVATION_DOMAIN"); value != "" {
		return strings.ToLower(value)
	}
	return defaultDomain
}

func quota() int64 {
	if value, err := strconv.ParseInt(activationEnv("JESUSMAIL_ACTIVATION_QUOTA", "JESSUSMAIL_ACTIVATION_QUOTA"), 10, 64); err == nil && value > 0 {
		return value
	}
	return defaultQuota
}

func Validate(key, prefix, password string) (string, string, error) {
	key = strings.ToUpper(strings.TrimSpace(key))
	prefix = strings.ToLower(strings.TrimSpace(prefix))
	if !keyPattern.MatchString(key) {
		return "", "", errors.New("激活密钥格式不正确")
	}
	if !prefixPattern.MatchString(prefix) || strings.Contains(prefix, "..") {
		return "", "", errors.New("前缀需为 3-30 位小写字母、数字或 . _ -，且以字母/数字开头结尾")
	}
	if _, ok := reservedPrefixes[prefix]; ok {
		return "", "", errors.New("该前缀为系统保留，请换一个")
	}
	if len(password) < 8 || len(password) > 64 || !passwordLetter.MatchString(password) || !passwordDigit.MatchString(password) {
		return "", "", errors.New("密码需 8-64 位，且同时包含字母和数字")
	}
	return key, prefix, nil
}

func AllowAttempt(ctx context.Context, ip string) (bool, error) {
	return allowAttempt(ctx, ip, g.Redis())
}

func allowAttempt(ctx context.Context, ip string, redis redisScriptEvaluator) (bool, error) {
	ip = strings.TrimSpace(ip)
	if ip == "" {
		ip = "unknown"
	}
	keys := []string{activationRateLimitPrefix + ip, legacyActivationRateLimitPrefix + ip}
	result, err := redis.Eval(ctx, activationRateLimitScript, int64(len(keys)), keys, []any{600})
	if err != nil {
		return false, fmt.Errorf("activation rate limit failed: %w", err)
	}
	return result.Int64() <= 8, nil
}

func Activate(ctx context.Context, keycode, prefix, password, ip string) (string, error) {
	keycode, prefix, err := Validate(keycode, prefix, password)
	if err != nil {
		return "", err
	}
	domain := Domain()
	email := prefix + "@" + domain
	mailbox := &mailboxv1.Mailbox{Username: email, Password: password, FullName: prefix, IsAdmin: 0, Quota: quota(), LocalPart: prefix, Domain: domain, Active: 1, QuotaActive: 1}

	err = g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		domainCount, err := tx.Model("domain").Ctx(ctx).Where("domain", domain).WhereNot("active", 0).Count()
		if err != nil {
			return fmt.Errorf("检查邮箱域名失败: %w", err)
		}
		if domainCount == 0 {
			return errors.New("激活域名尚未启用")
		}

		result, err := tx.Model("activation_keys").Ctx(ctx).
			Where("keycode", keycode).Where("status", 0).
			Data(g.Map{"status": 1, "used_at": time.Now(), "used_ip": ip, "email": email}).Update()
		if err != nil {
			return fmt.Errorf("核销激活码失败: %w", err)
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("确认激活码状态失败: %w", err)
		}
		if affected != 1 {
			return ErrInvalidKey
		}

		if err = mail_boxes.PrepareForInsert(ctx, mailbox); err != nil {
			return err
		}
		if _, err = tx.Model("mailbox").Ctx(ctx).Insert(mailbox); err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(strings.ToLower(err.Error()), "unique") {
				return ErrMailboxExists
			}
			return fmt.Errorf("创建邮箱失败: %w", err)
		}
		if _, err = tx.Model("activation_logs").Ctx(ctx).Data(g.Map{"keycode": keycode, "email": email, "ip": ip}).Insert(); err != nil {
			return fmt.Errorf("记录激活日志失败: %w", err)
		}
		return nil
	})
	if err != nil {
		return "", err
	}
	if err := mail_boxes.EnsureStorage(ctx, mailbox); err != nil {
		g.Log().Warning(ctx, "activation mailbox storage initialization failed:", err)
	}
	return email, nil
}

func GetStats(ctx context.Context) (Stats, error) {
	var out Stats
	err := g.DB().GetScan(ctx, &out, `SELECT COUNT(*)::int total, COUNT(*) FILTER (WHERE status=0)::int unused, COUNT(*) FILTER (WHERE status=1)::int used, COUNT(*) FILTER (WHERE status=2)::int disabled FROM activation_keys`)
	return out, err
}

func List(ctx context.Context, page, pageSize, status int, group string) (ListResult, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 5 {
		pageSize = 50
	}
	if pageSize > 500 {
		pageSize = 500
	}
	m := g.DB().Model("activation_keys").Ctx(ctx)
	if status >= 0 && status <= 2 {
		m = m.Where("status", status)
	}
	if group == "__none__" {
		m = m.Where("group_name", "")
	} else if group != "" {
		m = m.Where("group_name", group)
	}
	total, err := m.Count()
	if err != nil {
		return ListResult{}, err
	}
	var rows []Key
	if err = m.Fields("id,keycode,status,used_at,used_ip,email,note,group_name,created_at").OrderAsc("id").Page(page, pageSize).Scan(&rows); err != nil {
		return ListResult{}, err
	}
	groupsVar, err := g.DB().Model("activation_keys").Ctx(ctx).WhereNot("group_name", "").OrderAsc("group_name").Distinct().Array("group_name")
	if err != nil {
		return ListResult{}, err
	}
	groups := make([]string, 0, len(groupsVar))
	for _, v := range groupsVar {
		groups = append(groups, v.String())
	}
	return ListResult{Total: total, Page: page, PageSize: pageSize, Groups: groups, List: rows}, nil
}

func generateKey() (string, error) {
	const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
	const maxUnbiasedByte = 256 - (256 % len(alphabet))

	b := make([]byte, 12)
	random := []byte{0}
	for i := range b {
		for {
			if _, err := rand.Read(random); err != nil {
				return "", err
			}
			if int(random[0]) >= maxUnbiasedByte {
				continue
			}
			b[i] = alphabet[int(random[0])%len(alphabet)]
			break
		}
	}
	return fmt.Sprintf("JESUSMAIL-%s-%s-%s", b[:4], b[4:8], b[8:12]), nil
}

func validateGenerateMetadata(note, group string) error {
	if utf8.RuneCountInString(note) > 255 || utf8.RuneCountInString(group) > 100 {
		return errors.New("备注或分组过长")
	}
	return nil
}

func validateGroupName(group string) error {
	if utf8.RuneCountInString(group) > 100 {
		return errors.New("分组名称过长")
	}
	return nil
}

func Generate(ctx context.Context, count int, note, group string) (int, error) {
	if count < 1 || count > 500 {
		return 0, errors.New("生成数量需在 1-500 之间")
	}
	note = strings.TrimSpace(note)
	group = strings.TrimSpace(group)
	if err := validateGenerateMetadata(note, group); err != nil {
		return 0, err
	}
	made := 0
	for guard := 0; made < count && guard < count*5; guard++ {
		key, err := generateKey()
		if err != nil {
			return made, err
		}
		result, err := g.DB().Model("activation_keys").Ctx(ctx).Data(g.Map{"keycode": key, "note": note, "group_name": group}).InsertIgnore()
		if err != nil {
			return made, err
		}
		n, _ := result.RowsAffected()
		made += int(n)
	}
	return made, nil
}

func SetGroup(ctx context.Context, ids []int64, group string) (int64, error) {
	if len(ids) == 0 || len(ids) > 500 {
		return 0, errors.New("请选择 1-500 个激活码")
	}
	group = strings.TrimSpace(group)
	if err := validateGroupName(group); err != nil {
		return 0, err
	}
	r, err := g.DB().Model("activation_keys").Ctx(ctx).WhereIn("id", ids).Data("group_name", group).Update()
	if err != nil {
		return 0, err
	}
	return r.RowsAffected()
}

type activationDeleteStore interface {
	CountNonUnused(ctx context.Context, ids []int64) (int64, error)
	LockKeycodes(ctx context.Context, ids []int64) ([]string, error)
	DeleteKeys(ctx context.Context, ids []int64, onlyUnused bool) (int64, error)
	DeleteLogs(ctx context.Context, keycodes []string) error
}

type activationDeleteTx struct {
	tx gdb.TX
}

func (s activationDeleteTx) CountNonUnused(ctx context.Context, ids []int64) (int64, error) {
	count, err := s.tx.Model("activation_keys").Ctx(ctx).WhereIn("id", ids).WhereNot("status", 0).Count()
	return int64(count), err
}

func (s activationDeleteTx) LockKeycodes(ctx context.Context, ids []int64) ([]string, error) {
	values, err := s.tx.Model("activation_keys").Ctx(ctx).Fields("keycode").WhereIn("id", ids).LockUpdate().Array("keycode")
	if err != nil {
		return nil, err
	}
	keycodes := make([]string, 0, len(values))
	for _, value := range values {
		if keycode := value.String(); keycode != "" {
			keycodes = append(keycodes, keycode)
		}
	}
	return keycodes, nil
}

func (s activationDeleteTx) DeleteKeys(ctx context.Context, ids []int64, onlyUnused bool) (int64, error) {
	m := s.tx.Model("activation_keys").Ctx(ctx).WhereIn("id", ids)
	if onlyUnused {
		m = m.Where("status", 0)
	}
	result, err := m.Delete()
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (s activationDeleteTx) DeleteLogs(ctx context.Context, keycodes []string) error {
	if len(keycodes) == 0 {
		return nil
	}
	_, err := s.tx.Model("activation_logs").Ctx(ctx).WhereIn("keycode", keycodes).Delete()
	return err
}

func deleteActivationKeys(ctx context.Context, store activationDeleteStore, ids []int64, force bool) (deleted, skipped int64, err error) {
	var keycodes []string
	if force {
		keycodes, err = store.LockKeycodes(ctx, ids)
	} else {
		skipped, err = store.CountNonUnused(ctx, ids)
	}
	if err != nil {
		return 0, 0, err
	}

	deleted, err = store.DeleteKeys(ctx, ids, !force)
	if err != nil {
		return 0, 0, err
	}
	if force {
		err = store.DeleteLogs(ctx, keycodes)
	}
	return
}

func Delete(ctx context.Context, ids []int64, force bool) (deleted, skipped int64, err error) {
	if len(ids) == 0 || len(ids) > 500 {
		return 0, 0, errors.New("请选择 1-500 个激活码")
	}
	err = g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		deleted, skipped, err = deleteActivationKeys(ctx, activationDeleteTx{tx: tx}, ids, force)
		return err
	})
	return
}
