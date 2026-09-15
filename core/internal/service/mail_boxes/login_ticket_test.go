package mail_boxes

import (
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeLoginTicketStore struct {
	values   map[string]string
	putKey   string
	putValue string
	putTTL   int64
	putErr   error
	takeErr  error
}

func newFakeLoginTicketStore() *fakeLoginTicketStore {
	return &fakeLoginTicketStore{values: make(map[string]string)}
}

func (f *fakeLoginTicketStore) Put(_ context.Context, key, username string, ttlSeconds int64) error {
	if f.putErr != nil {
		return f.putErr
	}
	f.putKey = key
	f.putValue = username
	f.putTTL = ttlSeconds
	f.values[key] = username
	return nil
}

func (f *fakeLoginTicketStore) Take(_ context.Context, key string) (string, bool, error) {
	if f.takeErr != nil {
		return "", false, f.takeErr
	}
	value, ok := f.values[key]
	if ok {
		delete(f.values, key)
	}
	return value, ok, nil
}

type fakeLoginTicketRepository struct {
	records map[string]mailboxLoginRecord
	err     error
}

func (f *fakeLoginTicketRepository) Find(_ context.Context, username string) (mailboxLoginRecord, bool, error) {
	if f.err != nil {
		return mailboxLoginRecord{}, false, f.err
	}
	record, ok := f.records[username]
	return record, ok, nil
}

func newTestLoginTicketService(store loginTicketStore, repository loginTicketRepository, secret string) *loginTicketService {
	return &loginTicketService{
		store:        store,
		repository:   repository,
		random:       bytes.NewReader(bytes.Repeat([]byte{0x5a}, 32)),
		secretLoader: func() string { return secret },
		now:          func() time.Time { return time.Date(2026, time.September, 15, 12, 0, 0, 0, time.UTC) },
	}
}

func activeLoginTicketRecord(username, password string) mailboxLoginRecord {
	return mailboxLoginRecord{
		Username:       username,
		Active:         1,
		PasswordEncode: PasswdEncode(context.Background(), password),
	}
}

func TestLoginTicketCreateStoresOnlyHashForSixtySeconds(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": activeLoginTicketRecord("user@example.com", "secret-password"),
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")

	ticket, err := service.create(ctx, " User@Example.com ")
	require.NoError(t, err)

	raw, err := base64.RawURLEncoding.DecodeString(ticket.Token)
	require.NoError(t, err)
	assert.Len(t, raw, 32)
	assert.Len(t, ticket.Token, 43)
	assert.Equal(t, LoginTicketExpiresInSeconds, ticket.ExpiresIn)
	assert.Equal(t, LoginTicketExpiresInSeconds, store.putTTL)
	assert.Equal(t, "user@example.com", store.putValue)
	assert.Equal(t, loginTicketRedisKey(ticket.Token), store.putKey)
	assert.True(t, strings.HasPrefix(store.putKey, loginTicketRedisPrefix))
	assert.NotContains(t, store.putKey, ticket.Token)
	assert.NotContains(t, store.putKey, "user@example.com")
}

func TestLoginTicketCreateRejectsWhenSSODisabled(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": activeLoginTicketRecord("user@example.com", "secret-password"),
	}}
	service := newTestLoginTicketService(store, repository, "")

	_, err := service.create(ctx, "user@example.com")
	assert.ErrorIs(t, err, ErrRoundcubeSSODisabled)
	assert.Empty(t, store.values)
}

func TestLoginTicketCreateRejectsMissingOrInactiveMailbox(t *testing.T) {
	ctx := context.Background()
	tests := []struct {
		name    string
		records map[string]mailboxLoginRecord
	}{
		{name: "missing", records: map[string]mailboxLoginRecord{}},
		{name: "inactive", records: map[string]mailboxLoginRecord{
			"user@example.com": {Username: "user@example.com", Active: 0},
		}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			service := newTestLoginTicketService(newFakeLoginTicketStore(), &fakeLoginTicketRepository{records: tt.records}, "shared-secret")
			_, err := service.create(ctx, "user@example.com")
			assert.ErrorIs(t, err, ErrMailboxUnavailable)
		})
	}
}

func TestLoginTicketCreateRejectsExpiredMailbox(t *testing.T) {
	ctx := context.Background()
	now := time.Date(2026, time.September, 15, 12, 0, 0, 0, time.UTC)

	for _, expiresAt := range []time.Time{now.Add(-time.Second), now} {
		record := activeLoginTicketRecord("user@example.com", "secret-password")
		record.ExpiresAt = &expiresAt
		service := newTestLoginTicketService(newFakeLoginTicketStore(), &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
			"user@example.com": record,
		}}, "shared-secret")
		service.now = func() time.Time { return now }

		_, err := service.create(ctx, "user@example.com")
		assert.ErrorIs(t, err, ErrMailboxUnavailable)
	}
}

func TestLoginTicketCreateAllowsPermanentAndUnexpiredMailbox(t *testing.T) {
	ctx := context.Background()
	now := time.Date(2026, time.September, 15, 12, 0, 0, 0, time.UTC)
	future := now.Add(time.Hour)

	for _, expiresAt := range []*time.Time{nil, &future} {
		record := activeLoginTicketRecord("user@example.com", "secret-password")
		record.ExpiresAt = expiresAt
		service := newTestLoginTicketService(newFakeLoginTicketStore(), &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
			"user@example.com": record,
		}}, "shared-secret")
		service.now = func() time.Time { return now }

		_, err := service.create(ctx, "user@example.com")
		require.NoError(t, err)
	}
}

func TestLoginTicketCanOnlyBeConsumedOnce(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": activeLoginTicketRecord("user@example.com", "secret-password"),
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")
	ticket, err := service.create(ctx, "user@example.com")
	require.NoError(t, err)

	credential, err := service.consume(ctx, ticket.Token, "shared-secret")
	require.NoError(t, err)
	assert.Equal(t, "user@example.com", credential.Username)
	assert.Equal(t, "secret-password", credential.Password)

	_, err = service.consume(ctx, ticket.Token, "shared-secret")
	assert.ErrorIs(t, err, ErrLoginTicketInvalid)
}

func TestLoginTicketConsumeRejectsInvalidSecretBeforeTicketLookup(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	service := newTestLoginTicketService(store, &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{}}, "shared-secret")

	_, err := service.consume(ctx, strings.Repeat("A", 43), "wrong-secret")
	assert.ErrorIs(t, err, ErrRoundcubeSSOForbidden)
	assert.Empty(t, store.values)

	service.secretLoader = func() string { return "" }
	_, err = service.consume(ctx, strings.Repeat("A", 43), "")
	assert.ErrorIs(t, err, ErrRoundcubeSSODisabled)
}

func TestLoginTicketConsumeRejectsMalformedExpiredAndTamperedTickets(t *testing.T) {
	ctx := context.Background()
	service := newTestLoginTicketService(newFakeLoginTicketStore(), &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{}}, "shared-secret")

	for _, ticket := range []string{"short", strings.Repeat("!", 43), base64.RawURLEncoding.EncodeToString(bytes.Repeat([]byte{1}, 32))} {
		_, err := service.consume(ctx, ticket, "shared-secret")
		assert.ErrorIs(t, err, ErrLoginTicketInvalid)
	}
}

func TestLoginTicketConsumeRechecksMailboxStateAfterAtomicTake(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": activeLoginTicketRecord("user@example.com", "secret-password"),
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")
	ticket, err := service.create(ctx, "user@example.com")
	require.NoError(t, err)

	record := repository.records["user@example.com"]
	record.Active = 0
	repository.records["user@example.com"] = record

	_, err = service.consume(ctx, ticket.Token, "shared-secret")
	assert.ErrorIs(t, err, ErrMailboxUnavailable)
	_, exists := store.values[loginTicketRedisKey(ticket.Token)]
	assert.False(t, exists, "ticket must stay consumed even when the mailbox becomes inactive")
}

func TestLoginTicketConsumeRejectsMailboxThatExpiredAfterIssuance(t *testing.T) {
	ctx := context.Background()
	now := time.Date(2026, time.September, 15, 12, 0, 0, 0, time.UTC)
	expiresAt := now.Add(time.Second)
	record := activeLoginTicketRecord("user@example.com", "secret-password")
	record.ExpiresAt = &expiresAt
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": record,
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")
	service.now = func() time.Time { return now }
	ticket, err := service.create(ctx, "user@example.com")
	require.NoError(t, err)

	service.now = func() time.Time { return expiresAt }
	_, err = service.consume(ctx, ticket.Token, "shared-secret")
	assert.ErrorIs(t, err, ErrMailboxUnavailable)
	_, exists := store.values[loginTicketRedisKey(ticket.Token)]
	assert.False(t, exists, "ticket must stay consumed when the mailbox expires")
}

func TestLoginTicketConsumeRejectsUndecodablePassword(t *testing.T) {
	ctx := context.Background()
	store := newFakeLoginTicketStore()
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": {Username: "user@example.com", Active: 1, PasswordEncode: "not-encoded"},
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")
	ticket, err := service.create(ctx, "user@example.com")
	require.NoError(t, err)

	credential, err := service.consume(ctx, ticket.Token, "shared-secret")
	assert.Error(t, err)
	assert.Empty(t, credential.Password)
	assert.NotContains(t, err.Error(), "not-encoded")
}

func TestLoginTicketInfrastructureErrorsAreWrapped(t *testing.T) {
	ctx := context.Background()
	storeErr := errors.New("redis unavailable")
	store := newFakeLoginTicketStore()
	store.putErr = storeErr
	repository := &fakeLoginTicketRepository{records: map[string]mailboxLoginRecord{
		"user@example.com": activeLoginTicketRecord("user@example.com", "secret-password"),
	}}
	service := newTestLoginTicketService(store, repository, "shared-secret")

	_, err := service.create(ctx, "user@example.com")
	assert.ErrorIs(t, err, storeErr)
}

func TestLoadRoundcubeSSOSecretPrecedenceAndLegacyFallback(t *testing.T) {
	tests := []struct {
		name        string
		environment map[string]string
		dockerEnv   map[string]string
		want        string
	}{
		{
			name: "primary process environment wins",
			environment: map[string]string{
				"JESUSMAIL_ROUNDCUBE_SSO_SECRET":  "primary-env",
				"JESSUSMAIL_ROUNDCUBE_SSO_SECRET": "legacy-env",
			},
			dockerEnv: map[string]string{"JESUSMAIL_ROUNDCUBE_SSO_SECRET": "primary-file"},
			want:      "primary-env",
		},
		{
			name: "legacy process environment remains compatible",
			environment: map[string]string{
				"JESSUSMAIL_ROUNDCUBE_SSO_SECRET": "legacy-env",
			},
			dockerEnv: map[string]string{"JESUSMAIL_ROUNDCUBE_SSO_SECRET": "primary-file"},
			want:      "legacy-env",
		},
		{
			name:      "primary mounted env fallback",
			dockerEnv: map[string]string{"JESUSMAIL_ROUNDCUBE_SSO_SECRET": "primary-file"},
			want:      "primary-file",
		},
		{
			name:      "legacy mounted env fallback",
			dockerEnv: map[string]string{"JESSUSMAIL_ROUNDCUBE_SSO_SECRET": "legacy-file"},
			want:      "legacy-file",
		},
		{name: "empty disables SSO", want: ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			getenv := func(key string) string { return tt.environment[key] }
			dockerEnv := func(key string) (string, error) {
				value, ok := tt.dockerEnv[key]
				if !ok {
					return "", errors.New("not found")
				}
				return value, nil
			}
			assert.Equal(t, tt.want, loadRoundcubeSSOSecret(getenv, dockerEnv))
		})
	}
}
