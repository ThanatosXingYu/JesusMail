package welcome

import (
	"context"
	"fmt"
	htmltemplate "html/template"
	"net/mail"
	"os"
	"strings"
	texttemplate "text/template"

	"jesusmail-core/internal/service/mail_service"
	"jesusmail-core/internal/service/public"
)

const ActivationDetailsSubject = "您的 JesusMail 登录信息"

type recoveryTemplateData struct {
	Email      string
	Password   string
	WebmailURL string
}

// SendActivationRecoveryEmail sends a one-time copy of the login details to the
// optional recovery address. The plaintext password is never persisted.
func SendActivationRecoveryEmail(ctx context.Context, email, password, recoveryEmail string) error {
	email = strings.ToLower(strings.TrimSpace(email))
	recoveryEmail = strings.ToLower(strings.TrimSpace(recoveryEmail))
	if password == "" {
		return fmt.Errorf("mailbox password is empty")
	}
	if _, _, err := splitRecipient(email); err != nil {
		return err
	}
	address, err := mail.ParseAddress(recoveryEmail)
	if err != nil || address.Name != "" || strings.ToLower(address.Address) != recoveryEmail {
		return fmt.Errorf("recovery email format is invalid")
	}

	config := LoadConfig(ctx)
	senderAddress, _, err := ResolveSender(email, config.Sender)
	if err != nil {
		return err
	}
	if err := ensureSystemMailbox(ctx, senderAddress); err != nil {
		return fmt.Errorf("prepare system sender mailbox: %w", err)
	}

	htmlBody, _, err := renderRecoveryTemplateFiles(ctx, email, password)
	if err != nil {
		return err
	}

	sender, err := newEmailSender(senderAddress)
	if err != nil {
		return fmt.Errorf("create activation recovery sender: %w", err)
	}
	defer sender.Close()

	message := mail_service.NewMessage(ActivationDetailsSubject, htmlBody)
	message.SetMessageID(sender.GenerateMessageID())
	message.SetRealName("JesusMail")
	if err := sender.Send(message, []string{recoveryEmail}); err != nil {
		return fmt.Errorf("send activation recovery email: %w", err)
	}
	return nil
}

func renderRecoveryTemplateFiles(ctx context.Context, email, password string) (htmlBody, txtBody string, err error) {
	htmlPath, txtPath := recoveryTemplatePaths()
	return renderRecoveryTemplates(ctx, email, password, htmlPath, txtPath)
}

func renderRecoveryTemplates(ctx context.Context, email, password, htmlPath, txtPath string) (htmlBody, txtBody string, err error) {
	recipient, domain, err := splitRecipient(email)
	if err != nil {
		return "", "", err
	}
	data := recoveryTemplateData{
		Email:      recipient,
		Password:   password,
		WebmailURL: webmailURL(domain),
	}

	htmlSource, err := loadTemplateContent(ctx, SystemTemplateRecovery, htmlPath)
	if err != nil {
		return "", "", fmt.Errorf("read recovery HTML template: %w", err)
	}
	htmlTemplate, err := htmltemplate.New("activation-recovery-html").Option("missingkey=error").Parse(htmlSource)
	if err != nil {
		return "", "", fmt.Errorf("parse recovery HTML template: %w", err)
	}
	var htmlBuilder strings.Builder
	if err := htmlTemplate.Execute(&htmlBuilder, data); err != nil {
		return "", "", fmt.Errorf("execute recovery HTML template: %w", err)
	}

	txtSource, err := loadTemplateContent(ctx, "", txtPath)
	if err != nil {
		return "", "", fmt.Errorf("read recovery TXT template: %w", err)
	}
	txtTemplate, err := texttemplate.New("activation-recovery-txt").Option("missingkey=error").Parse(txtSource)
	if err != nil {
		return "", "", fmt.Errorf("parse recovery TXT template: %w", err)
	}
	var txtBuilder strings.Builder
	if err := txtTemplate.Execute(&txtBuilder, data); err != nil {
		return "", "", fmt.Errorf("execute recovery TXT template: %w", err)
	}
	return htmlBuilder.String(), txtBuilder.String(), nil
}

func recoveryTemplatePaths() (htmlPath, txtPath string) {
	base := public.AbsPath("../core/template/activation_recovery_email")
	return strings.TrimRight(base, string(os.PathSeparator)) + string(os.PathSeparator) + "recovery_email.html",
		strings.TrimRight(base, string(os.PathSeparator)) + string(os.PathSeparator) + "recovery_email.txt"
}
