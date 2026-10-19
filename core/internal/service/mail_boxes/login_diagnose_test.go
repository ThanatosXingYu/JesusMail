package mail_boxes

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeLoginDiagnosisRepository struct {
	record loginDiagnosisRecord
	found  bool
	err    error
	calls  int
}

func (f *fakeLoginDiagnosisRepository) Find(_ context.Context, _ string) (loginDiagnosisRecord, bool, error) {
	f.calls++
	return f.record, f.found, f.err
}

type fakeLoginDiagnosisStore struct {
	failures int64
	foundKey string
	recorded int
	cleared  int
	err      error
}

func (f *fakeLoginDiagnosisStore) Failures(_ context.Context, key string) (int64, error) {
	f.foundKey = key
	return f.failures, f.err
}

func (f *fakeLoginDiagnosisStore) RecordFailure(_ context.Context, _ string, _ int64) error {
	f.recorded++
	return f.err
}

func (f *fakeLoginDiagnosisStore) ClearFailures(_ context.Context, _ string) error {
	f.cleared++
	return f.err
}

func newTestLoginDiagnosisService(record loginDiagnosisRecord, found bool) (*loginDiagnosisService, *fakeLoginDiagnosisRepository, *fakeLoginDiagnosisStore) {
	repository := &fakeLoginDiagnosisRepository{record: record, found: found}
	store := &fakeLoginDiagnosisStore{}
	return &loginDiagnosisService{
		repository: repository,
		store:      store,
		now:        func() time.Time { return time.Date(2026, time.October, 19, 12, 0, 0, 0, time.UTC) },
	}, repository, store
}

func TestLoginDiagnosisClassifiesFailures(t *testing.T) {
	ctx := context.Background()
	hash, err := PasswdMD5Crypt(ctx, "correct-password")
	require.NoError(t, err)
	now := time.Date(2026, time.October, 19, 12, 0, 0, 0, time.UTC)
	expired := now.Add(-time.Minute)
	future := now.Add(time.Hour)

	tests := []struct {
		name       string
		record     loginDiagnosisRecord
		found      bool
		password   string
		wantStatus string
		wantRecord bool
	}{
		{
			name:       "missing mailbox",
			found:      false,
			password:   "anything",
			wantStatus: LoginDiagnosisNotFound,
			wantRecord: true,
		},
		{
			name: "inactive mailbox",
			record: loginDiagnosisRecord{
				Username: "user@example.com", Password: hash, Active: 0,
			},
			found:      true,
			password:   "correct-password",
			wantStatus: LoginDiagnosisUnavailable,
			wantRecord: true,
		},
		{
			name: "expired mailbox",
			record: loginDiagnosisRecord{
				Username: "user@example.com", Password: hash, Active: 1, ExpiresAt: &expired,
			},
			found:      true,
			password:   "correct-password",
			wantStatus: LoginDiagnosisUnavailable,
			wantRecord: true,
		},
		{
			name: "wrong password",
			record: loginDiagnosisRecord{
				Username: "user@example.com", Password: hash, Active: 1, ExpiresAt: &future,
			},
			found:      true,
			password:   "wrong-password",
			wantStatus: LoginDiagnosisWrongPassword,
			wantRecord: true,
		},
		{
			name: "valid permanent mailbox",
			record: loginDiagnosisRecord{
				Username: "user@example.com", Password: hash, Active: 1,
			},
			found:      true,
			password:   "correct-password",
			wantStatus: LoginDiagnosisOK,
			wantRecord: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			service, repository, store := newTestLoginDiagnosisService(tt.record, tt.found)
			result, err := service.diagnose(ctx, " USER@example.com ", tt.password, "203.0.113.10")
			require.NoError(t, err)
			assert.Equal(t, tt.wantStatus, result.Status)
			assert.Equal(t, 1, repository.calls)
			if tt.wantRecord {
				assert.Equal(t, 1, store.recorded)
				assert.Zero(t, store.cleared)
			} else {
				assert.Zero(t, store.recorded)
				assert.Equal(t, 1, store.cleared)
			}
			assert.NotContains(t, store.foundKey, "user@example.com")
			assert.NotContains(t, store.foundKey, "203.0.113.10")
		})
	}
}

func TestLoginDiagnosisRejectsInvalidEmailBeforeLookup(t *testing.T) {
	service, repository, _ := newTestLoginDiagnosisService(loginDiagnosisRecord{}, false)
	result, err := service.diagnose(context.Background(), "not-an-email", "password", "203.0.113.10")
	require.NoError(t, err)
	assert.Equal(t, LoginDiagnosisInvalidEmail, result.Status)
	assert.Zero(t, repository.calls)
}

func TestLoginDiagnosisRateLimitsBeforeLookup(t *testing.T) {
	service, repository, store := newTestLoginDiagnosisService(loginDiagnosisRecord{}, false)
	store.failures = loginDiagnosisRateLimit
	result, err := service.diagnose(context.Background(), "user@example.com", "password", "203.0.113.10")
	require.NoError(t, err)
	assert.Equal(t, LoginDiagnosisRateLimited, result.Status)
	assert.Zero(t, repository.calls)
}

func TestVerifyLoginDiagnosisPasswordRejectsInvalidHash(t *testing.T) {
	assert.ErrorIs(t, verifyLoginDiagnosisPassword("", "password"), errLoginPasswordMismatch)
	assert.ErrorIs(t, verifyLoginDiagnosisPassword("not-a-crypt-hash", "password"), errLoginPasswordMismatch)
}
