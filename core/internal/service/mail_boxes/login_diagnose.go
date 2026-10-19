package mail_boxes

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/GehirnInc/crypt/md5_crypt"
	"github.com/gogf/gf/v2/frame/g"
)

const (
	LoginDiagnosisOK            = "ok"
	LoginDiagnosisInvalidEmail  = "invalid_email"
	LoginDiagnosisNotFound      = "not_found"
	LoginDiagnosisUnavailable   = "unavailable"
	LoginDiagnosisWrongPassword = "wrong_password"
	LoginDiagnosisRateLimited   = "rate_limited"

	loginDiagnosisRatePrefix     = "JESUSMAIL_LOGIN_DIAGNOSE_RATE:"
	loginDiagnosisRateLimit      = int64(5)
	loginDiagnosisRateTTLSeconds = int64(600)
)

type LoginDiagnosis struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type loginDiagnosisRecord struct {
	Username  string     `json:"username"`
	Password  string     `json:"password"`
	Active    int        `json:"active"`
	ExpiresAt *time.Time `json:"expires_at"`
}

type loginDiagnosisRepository interface {
	Find(ctx context.Context, username string) (loginDiagnosisRecord, bool, error)
}

type loginDiagnosisStore interface {
	Failures(ctx context.Context, key string) (int64, error)
	RecordFailure(ctx context.Context, key string, ttlSeconds int64) error
	ClearFailures(ctx context.Context, key string) error
}

type databaseLoginDiagnosisRepository struct{}

func (databaseLoginDiagnosisRepository) Find(ctx context.Context, username string) (loginDiagnosisRecord, bool, error) {
	record, err := g.DB().Model("mailbox").Ctx(ctx).
		Fields("username", "password", "active", "expires_at").
		Where("username", username).
		One()
	if err != nil {
		return loginDiagnosisRecord{}, false, err
	}
	if record.IsEmpty() {
		return loginDiagnosisRecord{}, false, nil
	}

	var mailbox loginDiagnosisRecord
	if err = record.Struct(&mailbox); err != nil {
		return loginDiagnosisRecord{}, false, err
	}
	return mailbox, true, nil
}

type redisLoginDiagnosisStore struct{}

func (redisLoginDiagnosisStore) Failures(ctx context.Context, key string) (int64, error) {
	value, err := g.Redis().Get(ctx, key)
	if err != nil {
		return 0, err
	}
	if value == nil || value.IsNil() {
		return 0, nil
	}
	return value.Int64(), nil
}

func (redisLoginDiagnosisStore) RecordFailure(ctx context.Context, key string, ttlSeconds int64) error {
	count, err := g.Redis().Incr(ctx, key)
	if err != nil {
		return err
	}
	if count == 1 {
		_, err = g.Redis().Expire(ctx, key, ttlSeconds)
	}
	return err
}

func (redisLoginDiagnosisStore) ClearFailures(ctx context.Context, key string) error {
	_, err := g.Redis().Del(ctx, key)
	return err
}

type loginDiagnosisService struct {
	repository loginDiagnosisRepository
	store      loginDiagnosisStore
	now        func() time.Time
}

func defaultLoginDiagnosisService() *loginDiagnosisService {
	return &loginDiagnosisService{
		repository: databaseLoginDiagnosisRepository{},
		store:      redisLoginDiagnosisStore{},
		now:        time.Now,
	}
}

// DiagnoseLogin examines a login attempt without logging credentials or exposing password data.
func DiagnoseLogin(ctx context.Context, username, password, clientIP string) (LoginDiagnosis, error) {
	return defaultLoginDiagnosisService().diagnose(ctx, username, password, clientIP)
}

func (s *loginDiagnosisService) diagnose(ctx context.Context, username, password, clientIP string) (LoginDiagnosis, error) {
	username = normalizeLoginTicketUsername(username)
	if username == "" {
		return LoginDiagnosis{
			Status:  LoginDiagnosisInvalidEmail,
			Message: "请输入完整的邮箱地址，例如 name@example.com。",
		}, nil
	}

	key := loginDiagnosisAttemptKey(username, clientIP)
	failures, err := s.store.Failures(ctx, key)
	if err != nil {
		return LoginDiagnosis{}, fmt.Errorf("check login diagnosis rate limit: %w", err)
	}
	if failures >= loginDiagnosisRateLimit {
		return LoginDiagnosis{
			Status:  LoginDiagnosisRateLimited,
			Message: "登录尝试次数过多，请 10 分钟后再试。",
		}, nil
	}

	record, found, err := s.repository.Find(ctx, username)
	if err != nil {
		return LoginDiagnosis{}, fmt.Errorf("find mailbox for login diagnosis: %w", err)
	}
	if !found {
		if err = s.store.RecordFailure(ctx, key, loginDiagnosisRateTTLSeconds); err != nil {
			return LoginDiagnosis{}, fmt.Errorf("record failed login diagnosis: %w", err)
		}
		return LoginDiagnosis{
			Status:  LoginDiagnosisNotFound,
			Message: "该邮箱不存在，请检查邮箱地址或先完成激活。",
		}, nil
	}
	if record.Active != 1 || (record.ExpiresAt != nil && !record.ExpiresAt.After(s.now())) {
		if err = s.store.RecordFailure(ctx, key, loginDiagnosisRateTTLSeconds); err != nil {
			return LoginDiagnosis{}, fmt.Errorf("record unavailable mailbox diagnosis: %w", err)
		}
		return LoginDiagnosis{
			Status:  LoginDiagnosisUnavailable,
			Message: "该邮箱已停用或已过期，请联系管理员。",
		}, nil
	}

	if err = verifyLoginDiagnosisPassword(record.Password, password); err != nil {
		if !errors.Is(err, errLoginPasswordMismatch) {
			return LoginDiagnosis{}, err
		}
		if err = s.store.RecordFailure(ctx, key, loginDiagnosisRateTTLSeconds); err != nil {
			return LoginDiagnosis{}, fmt.Errorf("record wrong password diagnosis: %w", err)
		}
		return LoginDiagnosis{
			Status:  LoginDiagnosisWrongPassword,
			Message: "密码错误，请重新输入。",
		}, nil
	}

	_ = s.store.ClearFailures(ctx, key)
	return LoginDiagnosis{Status: LoginDiagnosisOK}, nil
}

var errLoginPasswordMismatch = errors.New("login password mismatch")

func verifyLoginDiagnosisPassword(storedHash, password string) error {
	if strings.TrimSpace(storedHash) == "" || password == "" {
		return errLoginPasswordMismatch
	}
	if err := md5_crypt.New().Verify(storedHash, []byte(password)); err != nil {
		return errLoginPasswordMismatch
	}
	return nil
}

func loginDiagnosisAttemptKey(username, clientIP string) string {
	clientIP = strings.TrimSpace(clientIP)
	if clientIP == "" {
		clientIP = "unknown"
	}
	hash := sha256.Sum256([]byte(strings.ToLower(username) + "\x00" + clientIP))
	return loginDiagnosisRatePrefix + hex.EncodeToString(hash[:])
}
