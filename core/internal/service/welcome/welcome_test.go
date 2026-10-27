package welcome

import (
	"context"
	"errors"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"
)

func useFileTemplateFallback(t *testing.T) {
	t.Helper()
	original := readManagedTemplateContent
	readManagedTemplateContent = nil
	t.Cleanup(func() {
		readManagedTemplateContent = original
	})
}

func TestConfigValidation(t *testing.T) {
	tests := []struct {
		name    string
		key     string
		value   string
		wantErr bool
	}{
		{name: "enabled", key: OptionEnabled, value: "false"},
		{name: "invalid enabled", key: OptionEnabled, value: "maybe", wantErr: true},
		{name: "empty sender uses default", key: OptionSender, value: " "},
		{name: "valid sender", key: OptionSender, value: " Welcome@Example.COM "},
		{name: "invalid sender", key: OptionSender, value: "not-an-email", wantErr: true},
		{name: "subject", key: OptionSubject, value: "  欢迎加入  "},
		{name: "empty subject", key: OptionSubject, value: " ", wantErr: true},
		{name: "header injection", key: OptionSubject, value: "hello\r\nBcc: victim@example.com", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var err error
			switch tt.key {
			case OptionEnabled:
				_, err = normalizeEnabled(tt.value)
			case OptionSender:
				_, err = normalizeOptionalSender(tt.value)
			case OptionSubject:
				_, err = normalizeSubject(tt.value)
			}
			if (err != nil) != tt.wantErr {
				t.Fatalf("validation error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestFailureBackoffAndTerminalState(t *testing.T) {
	now := time.Date(2026, 10, 26, 8, 0, 0, 0, time.UTC)
	tests := []struct {
		retryCount int
		wantStatus string
		wantDelay  time.Duration
	}{
		{retryCount: 0, wantStatus: StatusPending, wantDelay: time.Minute},
		{retryCount: 1, wantStatus: StatusPending, wantDelay: 2 * time.Minute},
		{retryCount: 2, wantStatus: StatusPending, wantDelay: 4 * time.Minute},
		{retryCount: 3, wantStatus: StatusPending, wantDelay: 8 * time.Minute},
		{retryCount: 4, wantStatus: StatusFailed, wantDelay: 0},
	}

	for _, tt := range tests {
		state := evaluateFailure(Job{RetryCount: tt.retryCount}, errors.New("smtp unavailable"), now)
		if state.RetryCount != tt.retryCount+1 {
			t.Errorf("retry count = %d, want %d", state.RetryCount, tt.retryCount+1)
		}
		if state.Status != tt.wantStatus {
			t.Errorf("retry %d status = %q, want %q", tt.retryCount+1, state.Status, tt.wantStatus)
		}
		if got := state.NextAttemptAt.Sub(now); got != tt.wantDelay {
			t.Errorf("retry %d delay = %v, want %v", tt.retryCount+1, got, tt.wantDelay)
		}
	}
}

func TestResolveSender(t *testing.T) {
	sender, isDefault, err := ResolveSender("student@Mail.Example.COM", "")
	if err != nil {
		t.Fatalf("ResolveSender() error = %v", err)
	}
	if !isDefault || sender != "noreply@mail.example.com" {
		t.Fatalf("ResolveSender() = %q, default=%v; want noreply@mail.example.com, true", sender, isDefault)
	}

	sender, isDefault, err = ResolveSender("student@mail.example.com", "welcome@example.com")
	if err != nil {
		t.Fatalf("ResolveSender(custom) error = %v", err)
	}
	if isDefault || sender != "welcome@example.com" {
		t.Fatalf("ResolveSender(custom) = %q, default=%v", sender, isDefault)
	}
}

func TestRenderActivationWelcomeTemplates(t *testing.T) {
	useFileTemplateFallback(t)
	originalResolver := resolveWebmailHost
	resolveWebmailHost = func(string) string { return "mail.example.com" }
	t.Cleanup(func() {
		resolveWebmailHost = originalResolver
	})

	_, testFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve test file path")
	}
	templateDir := filepath.Join(filepath.Dir(testFile), "..", "..", "..", "template", "activation_welcome_email")
	htmlBody, txtBody, err := renderTemplateFiles(
		context.Background(),
		"student@mail.example.com",
		filepath.Join(templateDir, "welcome_email.html"),
		filepath.Join(templateDir, "welcome_email.txt"),
	)
	if err != nil {
		t.Fatalf("renderTemplateFiles() error = %v", err)
	}

	required := []string{
		"student@mail.example.com",
		"https://mail.example.com/roundcube/",
		"欢迎",
		"妥善保管密码",
	}
	for _, fragment := range required {
		if !strings.Contains(htmlBody, fragment) {
			t.Errorf("HTML template missing %q", fragment)
		}
		if !strings.Contains(txtBody, fragment) {
			t.Errorf("TXT template missing %q", fragment)
		}
	}
	for _, fragment := range []string{"SMTP", "IMAP", "POP3", "41443"} {
		if strings.Contains(htmlBody, fragment) || strings.Contains(txtBody, fragment) {
			t.Errorf("welcome template must not contain %q", fragment)
		}
	}
}

func TestWebmailURL(t *testing.T) {
	originalResolver := resolveWebmailHost
	resolveWebmailHost = func(string) string { return "mail.example.com" }
	t.Cleanup(func() {
		resolveWebmailHost = originalResolver
	})

	if got := webmailURL("mail.example.com"); got != "https://mail.example.com/roundcube/" {
		t.Fatalf("webmailURL() = %q", got)
	}
}

func TestRenderActivationRecoveryTemplateContainsCredentials(t *testing.T) {
	useFileTemplateFallback(t)
	originalResolver := resolveWebmailHost
	resolveWebmailHost = func(string) string { return "mail.example.com" }
	t.Cleanup(func() {
		resolveWebmailHost = originalResolver
	})

	_, testFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("resolve test file path")
	}
	templateDir := filepath.Join(filepath.Dir(testFile), "..", "..", "..", "template", "activation_recovery_email")
	htmlBody, txtBody, err := renderRecoveryTemplates(
		context.Background(),
		"student@mail.example.com",
		"Pass<word&9",
		filepath.Join(templateDir, "recovery_email.html"),
		filepath.Join(templateDir, "recovery_email.txt"),
	)
	if err != nil {
		t.Fatalf("renderRecoveryTemplateFiles() error = %v", err)
	}
	for _, body := range []string{htmlBody, txtBody} {
		if !strings.Contains(body, "student@mail.example.com") ||
			!strings.Contains(body, "https://mail.example.com/roundcube/") {
			t.Fatalf("recovery template is missing login details: %s", body)
		}
	}
	if !strings.Contains(htmlBody, "Pass&lt;word&amp;9") {
		t.Fatal("recovery HTML template did not escape the password")
	}
	if !strings.Contains(txtBody, "Pass<word&9") {
		t.Fatal("recovery TXT template is missing the password")
	}
	for _, body := range []string{htmlBody, txtBody} {
		if strings.Contains(body, "SMTP") || strings.Contains(body, ":41443") {
			t.Fatal("recovery template contains infrastructure details")
		}
	}
}

func TestAdminTemplateSeedsAreComplete(t *testing.T) {
	seeds := adminTemplateSeeds()
	if len(seeds) != 2 {
		t.Fatalf("adminTemplateSeeds() length = %d, want 2", len(seeds))
	}
	seen := make(map[string]struct{}, len(seeds))
	for _, seed := range seeds {
		if seed.Key == "" || seed.Name == "" {
			t.Fatalf("system template seed is incomplete: %+v", seed)
		}
		if _, exists := seen[seed.Key]; exists {
			t.Fatalf("duplicate system template key: %s", seed.Key)
		}
		seen[seed.Key] = struct{}{}
		if !strings.HasSuffix(seed.Path, ".html") {
			t.Fatalf("system template path is invalid: %s", seed.Path)
		}
	}
}
