package settings

import (
	"testing"
)

func TestWelcomeEmailConfigKeysUseOptionStorage(t *testing.T) {
	keys := []string{
		"welcome_email_enabled",
		"WELCOME_EMAIL_SENDER",
		" welcome_email_subject ",
	}
	for _, key := range keys {
		if !isWelcomeEmailConfigKey(key) {
			t.Errorf("isWelcomeEmailConfigKey(%q) = false, want true", key)
		}
		envKey, modified := convertJsonKeyToEnvKey(key, "value", map[string]string{})
		if envKey != "" || modified {
			t.Errorf("welcome setting %q should not map to env, got key=%q modified=%v", key, envKey, modified)
		}
	}

	if isWelcomeEmailConfigKey("timezone") {
		t.Fatal("timezone must keep using existing system config handling")
	}
}
