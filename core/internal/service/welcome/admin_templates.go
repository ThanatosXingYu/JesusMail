package welcome

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/frame/g"
)

const (
	SystemTemplateWelcome  = "activation_welcome"
	SystemTemplateRecovery = "activation_recovery"
)

type adminTemplateSeed struct {
	Key  string
	Name string
	Path string
}

var readManagedTemplateContent = func(ctx context.Context, systemKey string) (string, error) {
	if strings.TrimSpace(systemKey) == "" {
		return "", nil
	}
	value, err := g.DB().Model("email_templates").Ctx(ctx).
		Where("system_key", systemKey).
		Value("content")
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(value.String()), nil
}

// EnsureAdminTemplates seeds editable system templates without overwriting
// content that an administrator has already customized.
func EnsureAdminTemplates(ctx context.Context) error {
	for _, seed := range adminTemplateSeeds() {
		count, err := g.DB().Model("email_templates").Ctx(ctx).
			Where("system_key", seed.Key).
			Count()
		if err != nil {
			return fmt.Errorf("check system template %s: %w", seed.Key, err)
		}
		if count != 0 {
			continue
		}

		content, err := os.ReadFile(seed.Path)
		if err != nil {
			return fmt.Errorf("read system template %s: %w", seed.Key, err)
		}
		now := time.Now().Unix()
		if _, err := g.DB().Model("email_templates").Ctx(ctx).Data(g.Map{
			"temp_name":   seed.Name,
			"add_type":    0,
			"content":     string(content),
			"render":      "",
			"chat_id":     "",
			"system_key":  seed.Key,
			"create_time": now,
			"update_time": now,
		}).InsertIgnore(); err != nil {
			return fmt.Errorf("seed system template %s: %w", seed.Key, err)
		}
	}
	return nil
}

func adminTemplateSeeds() []adminTemplateSeed {
	return []adminTemplateSeed{
		{
			Key:  SystemTemplateWelcome,
			Name: "系统模板·激活欢迎邮件",
			Path: public.AbsPath("../core/template/activation_welcome_email/welcome_email.html"),
		},
		{
			Key:  SystemTemplateRecovery,
			Name: "系统模板·激活凭据通知",
			Path: public.AbsPath("../core/template/activation_recovery_email/recovery_email.html"),
		},
	}
}

func loadTemplateContent(ctx context.Context, systemKey, fallbackPath string) (string, error) {
	if readManagedTemplateContent != nil {
		if content, err := readManagedTemplateContent(ctx, systemKey); err == nil && content != "" {
			return content, nil
		}
	}
	content, err := os.ReadFile(fallbackPath)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
