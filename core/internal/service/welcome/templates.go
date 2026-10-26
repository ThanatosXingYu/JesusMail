package welcome

import (
	"fmt"
	htmltemplate "html/template"
	"os"
	"strings"
	texttemplate "text/template"

	"jesusmail-core/internal/service/public"
)

type TemplateData struct {
	Email      string
	WebmailURL string
}

var resolveWebmailHost = public.FormatMX

func renderTemplateFiles(email, htmlPath, txtPath string) (htmlBody, txtBody string, err error) {
	recipient, domain, err := splitRecipient(email)
	if err != nil {
		return "", "", err
	}
	data := TemplateData{
		Email:      recipient,
		WebmailURL: webmailURL(domain),
	}

	htmlSource, err := os.ReadFile(htmlPath)
	if err != nil {
		return "", "", fmt.Errorf("read HTML template: %w", err)
	}
	htmlTemplate, err := htmltemplate.New("activation-welcome-html").Option("missingkey=error").Parse(string(htmlSource))
	if err != nil {
		return "", "", fmt.Errorf("parse HTML template: %w", err)
	}
	var htmlBuilder strings.Builder
	if err := htmlTemplate.Execute(&htmlBuilder, data); err != nil {
		return "", "", fmt.Errorf("execute HTML template: %w", err)
	}

	txtSource, err := os.ReadFile(txtPath)
	if err != nil {
		return "", "", fmt.Errorf("read TXT template: %w", err)
	}
	txtTemplate, err := texttemplate.New("activation-welcome-txt").Option("missingkey=error").Parse(string(txtSource))
	if err != nil {
		return "", "", fmt.Errorf("parse TXT template: %w", err)
	}
	var txtBuilder strings.Builder
	if err := txtTemplate.Execute(&txtBuilder, data); err != nil {
		return "", "", fmt.Errorf("execute TXT template: %w", err)
	}

	return htmlBuilder.String(), txtBuilder.String(), nil
}

func webmailURL(recipientDomain string) string {
	host := strings.Trim(strings.TrimSpace(resolveWebmailHost(recipientDomain)), "/")
	if host == "" {
		host = strings.Trim(recipientDomain, "/")
	}
	return "https://" + host + "/roundcube/"
}
