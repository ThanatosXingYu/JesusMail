package activation

import (
	"testing"
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
			name:       "normalizes valid input",
			key:        " qlu-abcd-2345-wxyz ",
			prefix:     " User.Name ",
			password:   "password8",
			wantKey:    "QLU-ABCD-2345-WXYZ",
			wantPrefix: "user.name",
		},
		{name: "rejects invalid key alphabet", key: "QLU-A0II-2345-WXYZ", prefix: "user1", password: "password8", wantErr: true},
		{name: "rejects short prefix", key: "QLU-ABCD-2345-WXYZ", prefix: "ab", password: "password8", wantErr: true},
		{name: "rejects long prefix", key: "QLU-ABCD-2345-WXYZ", prefix: "abcdefghijklmnopqrstuvwxyz12345", password: "password8", wantErr: true},
		{name: "rejects double dot", key: "QLU-ABCD-2345-WXYZ", prefix: "user..name", password: "password8", wantErr: true},
		{name: "rejects reserved prefix", key: "QLU-ABCD-2345-WXYZ", prefix: "Admin", password: "password8", wantErr: true},
		{name: "rejects password without digit", key: "QLU-ABCD-2345-WXYZ", prefix: "user1", password: "password", wantErr: true},
		{name: "rejects password without letter", key: "QLU-ABCD-2345-WXYZ", prefix: "user1", password: "12345678", wantErr: true},
		{name: "rejects short password", key: "QLU-ABCD-2345-WXYZ", prefix: "user1", password: "pass123", wantErr: true},
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
