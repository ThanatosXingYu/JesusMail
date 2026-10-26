package welcome

import (
	"context"
	"fmt"
	"net/mail"
	"strconv"
	"strings"
	"unicode/utf8"

	"jesusmail-core/internal/service/public"
)

const (
	OptionEnabled = "activation_welcome_enabled"
	OptionSender  = "activation_welcome_sender"
	OptionSubject = "activation_welcome_subject"

	APIKeyEnabled = "welcome_email_enabled"
	APIKeySender  = "welcome_email_sender"
	APIKeySubject = "welcome_email_subject"

	DefaultSubject = "您的 JesusMail 邮箱已成功激活"
)

type Config struct {
	Enabled bool   `json:"enabled"`
	Sender  string `json:"sender"`
	Subject string `json:"subject"`
}

func DefaultConfig() Config {
	return Config{
		Enabled: true,
		Subject: DefaultSubject,
	}
}

// LoadConfig returns the activation welcome settings, falling back to safe defaults.
func LoadConfig(ctx context.Context) Config {
	config := DefaultConfig()

	var enabled bool
	if err := public.OptionsMgrInstance.GetOption(ctx, OptionEnabled, &enabled); err == nil {
		config.Enabled = enabled
	}

	var sender string
	if err := public.OptionsMgrInstance.GetOption(ctx, OptionSender, &sender); err == nil {
		config.Sender = strings.ToLower(strings.TrimSpace(sender))
	}

	var subject string
	if err := public.OptionsMgrInstance.GetOption(ctx, OptionSubject, &subject); err == nil && strings.TrimSpace(subject) != "" {
		config.Subject = strings.TrimSpace(subject)
	}

	return config
}

// SetConfigValue validates and persists one welcome setting without requiring a restart.
func SetConfigValue(ctx context.Context, key, value string) error {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case APIKeyEnabled, OptionEnabled:
		enabled, err := normalizeEnabled(value)
		if err != nil {
			return err
		}
		return public.OptionsMgrInstance.SetOption(ctx, OptionEnabled, enabled)

	case APIKeySender, OptionSender:
		sender, err := normalizeOptionalSender(value)
		if err != nil {
			return err
		}
		return public.OptionsMgrInstance.SetOption(ctx, OptionSender, sender)

	case APIKeySubject, OptionSubject:
		subject, err := normalizeSubject(value)
		if err != nil {
			return err
		}
		return public.OptionsMgrInstance.SetOption(ctx, OptionSubject, subject)

	default:
		return fmt.Errorf("unsupported welcome email setting %q", key)
	}
}

func normalizeEnabled(value string) (bool, error) {
	enabled, err := strconv.ParseBool(strings.TrimSpace(value))
	if err != nil {
		return false, fmt.Errorf("welcome email enabled value must be true or false")
	}
	return enabled, nil
}

func normalizeOptionalSender(value string) (string, error) {
	sender := strings.ToLower(strings.TrimSpace(value))
	if sender == "" {
		return "", nil
	}
	if strings.ContainsAny(sender, "\r\n") {
		return "", fmt.Errorf("sender email contains illegal characters")
	}

	address, err := mail.ParseAddress(sender)
	if err != nil || address.Name != "" || strings.ToLower(address.Address) != sender {
		return "", fmt.Errorf("sender email format is invalid")
	}
	return sender, nil
}

func normalizeSubject(value string) (string, error) {
	subject := strings.TrimSpace(value)
	if subject == "" {
		return "", fmt.Errorf("welcome email subject cannot be empty")
	}
	if strings.ContainsAny(subject, "\r\n") {
		return "", fmt.Errorf("welcome email subject contains illegal characters")
	}
	if utf8.RuneCountInString(subject) > 200 {
		return "", fmt.Errorf("welcome email subject cannot exceed 200 characters")
	}
	return subject, nil
}

// ResolveSender returns the configured custom sender, or noreply@<recipient domain>.
func ResolveSender(recipient, configured string) (string, bool, error) {
	configured = strings.ToLower(strings.TrimSpace(configured))
	if configured != "" {
		return configured, false, nil
	}

	_, domain, err := splitRecipient(recipient)
	if err != nil {
		return "", false, err
	}
	return "noreply@" + domain, true, nil
}
