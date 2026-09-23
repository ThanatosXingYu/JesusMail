package mail_boxes

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/frame/g"
)

const (
	LoginTicketExpiresInSeconds int64 = 60
	loginTicketRedisPrefix            = "JESUSMAIL_ROUNDCUBE_LOGIN_TICKET:"
)

const loginTicketGetDelScript = `
local value = redis.call('GET', KEYS[1])
if value then
    redis.call('DEL', KEYS[1])
end
return value
`

var (
	ErrLoginTicketInvalid    = errors.New("login ticket is invalid or expired")
	ErrMailboxUnavailable    = errors.New("mailbox does not exist, is inactive, or is expired")
	ErrRoundcubeSSODisabled  = errors.New("Roundcube SSO is disabled")
	ErrRoundcubeSSOForbidden = errors.New("Roundcube SSO authentication failed")
)

type LoginTicket struct {
	Token     string
	ExpiresIn int64
}

type LoginCredential struct {
	Username string
	Password string
}

type mailboxLoginRecord struct {
	Username       string     `json:"username"`
	Active         int        `json:"active"`
	PasswordEncode string     `json:"password_encode"`
	ExpiresAt      *time.Time `json:"expires_at"`
}

type loginTicketStore interface {
	Put(ctx context.Context, key, username string, ttlSeconds int64) error
	Take(ctx context.Context, key string) (username string, found bool, err error)
}

type loginTicketRepository interface {
	Find(ctx context.Context, username string) (record mailboxLoginRecord, found bool, err error)
}

type loginTicketService struct {
	store        loginTicketStore
	repository   loginTicketRepository
	random       io.Reader
	secretLoader func() string
	now          func() time.Time
}

type redisLoginTicketStore struct{}

type databaseLoginTicketRepository struct{}

func (redisLoginTicketStore) Put(ctx context.Context, key, username string, ttlSeconds int64) error {
	return g.Redis().SetEX(ctx, key, username, ttlSeconds)
}

func (redisLoginTicketStore) Take(ctx context.Context, key string) (string, bool, error) {
	value, err := g.Redis().Eval(ctx, loginTicketGetDelScript, 1, []string{key}, nil)
	if err != nil {
		return "", false, err
	}
	if value == nil || value.IsNil() {
		return "", false, nil
	}
	return value.String(), true, nil
}

func (databaseLoginTicketRepository) Find(ctx context.Context, username string) (mailboxLoginRecord, bool, error) {
	model := g.DB().Model("mailbox").Ctx(ctx)
	fields := []string{"username", "active", "password_encode"}
	hasExpiresAt, err := model.HasField("expires_at")
	if err != nil {
		return mailboxLoginRecord{}, false, fmt.Errorf("inspect mailbox expiration field: %w", err)
	}
	if hasExpiresAt {
		fields = append(fields, "expires_at")
	}

	record, err := model.
		Fields(fields).
		Where("username", username).
		One()
	if err != nil {
		return mailboxLoginRecord{}, false, err
	}
	if record.IsEmpty() {
		return mailboxLoginRecord{}, false, nil
	}

	var mailbox mailboxLoginRecord
	if err = record.Struct(&mailbox); err != nil {
		return mailboxLoginRecord{}, false, err
	}
	return mailbox, true, nil
}

func defaultLoginTicketService() *loginTicketService {
	return &loginTicketService{
		store:        redisLoginTicketStore{},
		repository:   databaseLoginTicketRepository{},
		random:       rand.Reader,
		secretLoader: RoundcubeSSOSecret,
		now:          time.Now,
	}
}

// CreateLoginTicket creates a short-lived opaque ticket after re-checking mailbox state server-side.
func CreateLoginTicket(ctx context.Context, username string) (LoginTicket, error) {
	return defaultLoginTicketService().create(ctx, username)
}

// ConsumeLoginTicket authenticates the internal Roundcube caller and atomically consumes a ticket.
func ConsumeLoginTicket(ctx context.Context, ticket, providedSecret string) (LoginCredential, error) {
	return defaultLoginTicketService().consume(ctx, ticket, providedSecret)
}

func (s *loginTicketService) create(ctx context.Context, username string) (LoginTicket, error) {
	username = normalizeLoginTicketUsername(username)
	if username == "" {
		return LoginTicket{}, ErrMailboxUnavailable
	}
	if s.secretLoader() == "" {
		return LoginTicket{}, ErrRoundcubeSSODisabled
	}

	mailbox, found, err := s.repository.Find(ctx, username)
	if err != nil {
		return LoginTicket{}, fmt.Errorf("check mailbox for login ticket: %w", err)
	}
	if !mailboxAllowsLogin(mailbox, found, username, s.now()) {
		return LoginTicket{}, ErrMailboxUnavailable
	}

	raw := make([]byte, 32)
	if _, err = io.ReadFull(s.random, raw); err != nil {
		return LoginTicket{}, fmt.Errorf("generate login ticket: %w", err)
	}
	token := base64.RawURLEncoding.EncodeToString(raw)
	key := loginTicketRedisKey(token)
	if err = s.store.Put(ctx, key, username, LoginTicketExpiresInSeconds); err != nil {
		return LoginTicket{}, fmt.Errorf("store login ticket: %w", err)
	}

	return LoginTicket{Token: token, ExpiresIn: LoginTicketExpiresInSeconds}, nil
}

func (s *loginTicketService) consume(ctx context.Context, ticket, providedSecret string) (LoginCredential, error) {
	expectedSecret := s.secretLoader()
	if expectedSecret == "" {
		return LoginCredential{}, ErrRoundcubeSSODisabled
	}
	if providedSecret == "" || !hmac.Equal([]byte(providedSecret), []byte(expectedSecret)) {
		return LoginCredential{}, ErrRoundcubeSSOForbidden
	}

	if !validLoginTicket(tokenWithoutWhitespace(ticket)) {
		return LoginCredential{}, ErrLoginTicketInvalid
	}
	ticket = tokenWithoutWhitespace(ticket)

	username, found, err := s.store.Take(ctx, loginTicketRedisKey(ticket))
	if err != nil {
		return LoginCredential{}, fmt.Errorf("consume login ticket: %w", err)
	}
	if !found {
		return LoginCredential{}, ErrLoginTicketInvalid
	}

	username = normalizeLoginTicketUsername(username)
	mailbox, found, err := s.repository.Find(ctx, username)
	if err != nil {
		return LoginCredential{}, fmt.Errorf("recheck mailbox for login ticket: %w", err)
	}
	if !mailboxAllowsLogin(mailbox, found, username, s.now()) {
		return LoginCredential{}, ErrMailboxUnavailable
	}

	password, err := PasswdDecode(ctx, mailbox.PasswordEncode)
	if err != nil || password == "" {
		if err == nil {
			err = errors.New("empty decoded password")
		}
		return LoginCredential{}, fmt.Errorf("decode mailbox password for login ticket: %w", err)
	}

	return LoginCredential{Username: username, Password: password}, nil
}

func mailboxAllowsLogin(mailbox mailboxLoginRecord, found bool, username string, now time.Time) bool {
	if !found || mailbox.Active != 1 || normalizeLoginTicketUsername(mailbox.Username) != username {
		return false
	}
	return mailbox.ExpiresAt == nil || mailbox.ExpiresAt.After(now)
}

func loginTicketRedisKey(token string) string {
	hash := sha256.Sum256([]byte(token))
	return loginTicketRedisPrefix + hex.EncodeToString(hash[:])
}

func validLoginTicket(ticket string) bool {
	if len(ticket) != 43 {
		return false
	}
	raw, err := base64.RawURLEncoding.DecodeString(ticket)
	return err == nil && len(raw) == 32
}

func tokenWithoutWhitespace(ticket string) string {
	return strings.TrimSpace(ticket)
}

func normalizeLoginTicketUsername(username string) string {
	username = strings.ToLower(strings.TrimSpace(username))
	if len(username) < 3 || len(username) > 320 || strings.Count(username, "@") != 1 || strings.ContainsAny(username, " \t\r\n") {
		return ""
	}
	parts := strings.SplitN(username, "@", 2)
	if parts[0] == "" || parts[1] == "" {
		return ""
	}
	return username
}

// RoundcubeSSOSecret loads the primary spelling first, then the legacy JESSUSMAIL spelling.
// Process environment takes precedence; the mounted project .env is supported for Core deployments.
func RoundcubeSSOSecret() string {
	return loadRoundcubeSSOSecret(os.Getenv, public.DockerEnv)
}

func loadRoundcubeSSOSecret(getenv func(string) string, dockerEnv func(string) (string, error)) string {
	keys := []string{"JESUSMAIL_ROUNDCUBE_SSO_SECRET", "JESSUSMAIL_ROUNDCUBE_SSO_SECRET"}
	for _, key := range keys {
		if value := strings.TrimSpace(getenv(key)); value != "" {
			return value
		}
	}
	for _, key := range keys {
		if value, err := dockerEnv(key); err == nil {
			if value = strings.TrimSpace(value); value != "" {
				return value
			}
		}
	}
	return ""
}
