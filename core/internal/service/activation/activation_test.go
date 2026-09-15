package activation

import (
	"context"
	"errors"
	"reflect"
	"strings"
	"testing"
	"time"

	"github.com/gogf/gf/v2/container/gvar"
)

func TestValidate(t *testing.T) {
	tests := []struct {
		name       string
		key        string
		prefix     string
		password   string
		wantKey    string
		wantPrefix string
		wantErr    bool
	}{
		{
			name:       "normalizes current key",
			key:        " jesusmail-abcd-2345-wxyz ",
			prefix:     " User.Name ",
			password:   "password8",
			wantKey:    "JESUSMAIL-ABCD-2345-WXYZ",
			wantPrefix: "user.name",
		},
		{
			name:       "accepts legacy QLU key",
			key:        " qlu-abcd-2345-wxyz ",
			prefix:     "user1",
			password:   "password8",
			wantKey:    "QLU-ABCD-2345-WXYZ",
			wantPrefix: "user1",
		},
		{name: "rejects invalid key alphabet", key: "JESUSMAIL-A0II-2345-WXYZ", prefix: "user1", password: "password8", wantErr: true},
		{name: "rejects short prefix", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "ab", password: "password8", wantErr: true},
		{name: "rejects long prefix", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "abcdefghijklmnopqrstuvwxyz12345", password: "password8", wantErr: true},
		{name: "rejects double dot", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "user..name", password: "password8", wantErr: true},
		{name: "rejects reserved prefix", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "Admin", password: "password8", wantErr: true},
		{name: "rejects password without digit", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "user1", password: "password", wantErr: true},
		{name: "rejects password without letter", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "user1", password: "12345678", wantErr: true},
		{name: "rejects short password", key: "JESUSMAIL-ABCD-2345-WXYZ", prefix: "user1", password: "pass123", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotKey, gotPrefix, err := Validate(tt.key, tt.prefix, tt.password)
			if tt.wantErr {
				if err == nil {
					t.Fatal("Validate() error = nil, want error")
				}
				return
			}
			if err != nil {
				t.Fatalf("Validate() unexpected error: %v", err)
			}
			if gotKey != tt.wantKey {
				t.Errorf("Validate() key = %q, want %q", gotKey, tt.wantKey)
			}
			if gotPrefix != tt.wantPrefix {
				t.Errorf("Validate() prefix = %q, want %q", gotPrefix, tt.wantPrefix)
			}
		})
	}
}

func TestGenerateKey(t *testing.T) {
	seen := make(map[string]struct{}, 256)
	for i := 0; i < 256; i++ {
		key, err := generateKey()
		if err != nil {
			t.Fatalf("generateKey() unexpected error: %v", err)
		}
		if !keyPattern.MatchString(key) {
			t.Fatalf("generateKey() = %q, invalid format", key)
		}
		if _, exists := seen[key]; exists {
			t.Fatalf("generateKey() produced duplicate %q", key)
		}
		seen[key] = struct{}{}
	}
}

func TestDomainConfiguration(t *testing.T) {
	t.Setenv("JESSUSMAIL_ACTIVATION_DOMAIN", " Mail.Example.COM ")
	if got := Domain(); got != "mail.example.com" {
		t.Fatalf("Domain() = %q, want mail.example.com", got)
	}
}

func TestQuotaConfiguration(t *testing.T) {
	t.Setenv("JESSUSMAIL_ACTIVATION_QUOTA", "67108864")
	if got := quota(); got != 67108864 {
		t.Fatalf("quota() = %d, want 67108864", got)
	}

	t.Setenv("JESSUSMAIL_ACTIVATION_QUOTA", "invalid")
	if got := quota(); got != defaultQuota {
		t.Fatalf("quota() = %d, want default %d", got, defaultQuota)
	}
}

type fakeRedisEvaluator struct {
	result  *gvar.Var
	err     error
	calls   int
	script  string
	numKeys int64
	keys    []string
	args    []any
}

func (f *fakeRedisEvaluator) Eval(_ context.Context, script string, numKeys int64, keys []string, args []any) (*gvar.Var, error) {
	f.calls++
	f.script = script
	f.numKeys = numKeys
	f.keys = append([]string(nil), keys...)
	f.args = append([]any(nil), args...)
	return f.result, f.err
}

func TestAllowAttemptUsesAtomicPrimaryAndLegacyKeys(t *testing.T) {
	redis := &fakeRedisEvaluator{result: gvar.New(int64(8))}
	allowed, err := allowAttempt(context.Background(), " 203.0.113.8 ", redis)
	if err != nil {
		t.Fatalf("allowAttempt() unexpected error: %v", err)
	}
	if !allowed {
		t.Fatal("allowAttempt() = false at limit, want true")
	}
	if redis.calls != 1 {
		t.Fatalf("Eval calls = %d, want 1", redis.calls)
	}
	if redis.numKeys != 2 {
		t.Fatalf("Eval numKeys = %d, want 2", redis.numKeys)
	}
	wantKeys := []string{"JESUSMAIL_ACTIVATE_RATE:203.0.113.8", "JESSUSMAIL_ACTIVATE_RATE:203.0.113.8"}
	if !reflect.DeepEqual(redis.keys, wantKeys) {
		t.Fatalf("Eval keys = %#v, want %#v", redis.keys, wantKeys)
	}
	if !reflect.DeepEqual(redis.args, []any{600}) {
		t.Fatalf("Eval args = %#v, want [600]", redis.args)
	}
	if !strings.Contains(redis.script, `redis.call("SET", KEYS[1], 1, "EX", ARGV[1])`) {
		t.Fatal("rate-limit script does not atomically create the expiring counter")
	}
}

func TestAllowAttemptRejectsAboveLimit(t *testing.T) {
	redis := &fakeRedisEvaluator{result: gvar.New(int64(9))}
	allowed, err := allowAttempt(context.Background(), "203.0.113.8", redis)
	if err != nil {
		t.Fatalf("allowAttempt() unexpected error: %v", err)
	}
	if allowed {
		t.Fatal("allowAttempt() = true above limit, want false")
	}
}

func TestAllowAttemptFailsClosedOnRedisError(t *testing.T) {
	redis := &fakeRedisEvaluator{err: errors.New("redis unavailable")}
	allowed, err := allowAttempt(context.Background(), "203.0.113.8", redis)
	if err == nil {
		t.Fatal("allowAttempt() error = nil, want error")
	}
	if allowed {
		t.Fatal("allowAttempt() = true on Redis error, want false")
	}
}

func TestActivationEnvironmentCompatibility(t *testing.T) {
	t.Run("primary domain wins", func(t *testing.T) {
		t.Setenv("JESUSMAIL_ACTIVATION_DOMAIN", " New.Example.COM ")
		t.Setenv("JESSUSMAIL_ACTIVATION_DOMAIN", "legacy.example.com")
		if got := Domain(); got != "new.example.com" {
			t.Fatalf("Domain() = %q, want new.example.com", got)
		}
	})

	t.Run("legacy domain remains supported", func(t *testing.T) {
		t.Setenv("JESUSMAIL_ACTIVATION_DOMAIN", "")
		t.Setenv("JESSUSMAIL_ACTIVATION_DOMAIN", " Legacy.Example.COM ")
		if got := Domain(); got != "legacy.example.com" {
			t.Fatalf("Domain() = %q, want legacy.example.com", got)
		}
	})

	t.Run("primary quota wins", func(t *testing.T) {
		t.Setenv("JESUSMAIL_ACTIVATION_QUOTA", "67108864")
		t.Setenv("JESSUSMAIL_ACTIVATION_QUOTA", "33554432")
		if got := quota(); got != 67108864 {
			t.Fatalf("quota() = %d, want 67108864", got)
		}
	})

	t.Run("legacy quota remains supported", func(t *testing.T) {
		t.Setenv("JESUSMAIL_ACTIVATION_QUOTA", "")
		t.Setenv("JESSUSMAIL_ACTIVATION_QUOTA", "16777216")
		if got := quota(); got != 16777216 {
			t.Fatalf("quota() = %d, want 16777216", got)
		}
	})
}

type fakeActivationDeleteStore struct {
	states      []activationDeleteState
	deleted     int64
	lockCalls   int
	deleteCalls int
	lockedIDs   []int64
	deletedIDs  []int64
}

func (s *fakeActivationDeleteStore) LockStates(_ context.Context, ids []int64) ([]activationDeleteState, error) {
	s.lockCalls++
	s.lockedIDs = append([]int64(nil), ids...)
	return append([]activationDeleteState(nil), s.states...), nil
}

func (s *fakeActivationDeleteStore) DeleteNotUsed(_ context.Context, ids []int64) (int64, error) {
	s.deleteCalls++
	s.deletedIDs = append([]int64(nil), ids...)
	return s.deleted, nil
}

func TestDeleteActivationKeysLocksAndSkipsOnlyUsed(t *testing.T) {
	store := &fakeActivationDeleteStore{
		states:  []activationDeleteState{{ID: 11, Status: 0}, {ID: 12, Status: 1}, {ID: 13, Status: 2}},
		deleted: 2,
	}

	deleted, skipped, err := deleteActivationKeys(context.Background(), store, []int64{11, 12, 13})
	if err != nil {
		t.Fatalf("deleteActivationKeys() unexpected error: %v", err)
	}
	if deleted != 2 || skipped != 1 {
		t.Fatalf("deleteActivationKeys() = deleted %d, skipped %d; want 2, 1", deleted, skipped)
	}
	if store.lockCalls != 1 || store.deleteCalls != 1 {
		t.Fatalf("unexpected calls: lock=%d delete=%d", store.lockCalls, store.deleteCalls)
	}
	if len(store.lockedIDs) != 3 || len(store.deletedIDs) != 3 {
		t.Fatalf("selected IDs were not passed through: locked=%v deleted=%v", store.lockedIDs, store.deletedIDs)
	}
}

func TestExpirationFromDurationBoundaries(t *testing.T) {
	now := time.Date(2026, time.September, 15, 12, 30, 0, 0, time.UTC)
	for _, days := range []int{0, 32} {
		if _, err := expirationFromDuration(now, days); err == nil {
			t.Fatalf("expirationFromDuration(%d) accepted invalid duration", days)
		}
	}
	for _, days := range []int{1, 31} {
		expiresAt, err := expirationFromDuration(now, days)
		if err != nil {
			t.Fatalf("expirationFromDuration(%d) unexpected error: %v", days, err)
		}
		want := now.AddDate(0, 0, days)
		if !expiresAt.Equal(want) {
			t.Fatalf("expirationFromDuration(%d) = %s, want %s", days, expiresAt, want)
		}
	}
}

func TestClearBindingStateGuards(t *testing.T) {
	original := &Key{Id: 7, Status: 1, Email: "user@example.com"}
	if !canClearBinding(original) {
		t.Fatal("used key with an email should be clearable")
	}
	if canClearBinding(&Key{Id: 7, Status: 0, Email: "user@example.com"}) {
		t.Fatal("unused key should be skipped")
	}
	if canClearBinding(&Key{Id: 7, Status: 1}) {
		t.Fatal("used key without an email should be skipped")
	}
	if !bindingStillMatches(&Key{Id: 7, Status: 1, Email: "user@example.com"}, original) {
		t.Fatal("unchanged binding should match")
	}
	if bindingStillMatches(&Key{Id: 7, Status: 1, Email: "other@example.com"}, original) {
		t.Fatal("email mismatch should reject reset")
	}
	if bindingStillMatches(&Key{Id: 7, Status: 0, Email: "user@example.com"}, original) {
		t.Fatal("status mismatch should reject reset")
	}
}

func TestClearBindingResetDataClearsUsageFields(t *testing.T) {
	data := clearBindingResetData()
	if status, ok := data["status"]; !ok || status != 0 {
		t.Fatalf("reset status = %#v, want 0", status)
	}
	for _, field := range []string{"used_at", "used_ip", "email"} {
		value, ok := data[field]
		if !ok || value != nil {
			t.Fatalf("reset field %s = %#v (present=%v), want explicit nil", field, value, ok)
		}
	}
}

func TestActivationMetadataLengthCountsUnicodeCharacters(t *testing.T) {
	if err := validateGenerateMetadata(strings.Repeat("新", 255), strings.Repeat("组", 100)); err != nil {
		t.Fatalf("Unicode metadata at character limits rejected: %v", err)
	}
	if err := validateGenerateMetadata(strings.Repeat("新", 256), ""); err == nil {
		t.Fatal("256-character note accepted, want rejection")
	}
	if err := validateGenerateMetadata("", strings.Repeat("组", 101)); err == nil {
		t.Fatal("101-character group accepted, want rejection")
	}
	if err := validateGroupName(strings.Repeat("组", 100)); err != nil {
		t.Fatalf("100-character Unicode group rejected: %v", err)
	}
	if err := validateGroupName(strings.Repeat("组", 101)); err == nil {
		t.Fatal("101-character Unicode group accepted, want rejection")
	}
}
