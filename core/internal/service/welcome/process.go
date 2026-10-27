package welcome

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	mailboxv1 "jesusmail-core/api/mail_boxes/v1"
	"jesusmail-core/internal/service/mail_boxes"
	"jesusmail-core/internal/service/mail_service"
	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/util/grand"
	"github.com/gogf/gf/v2/frame/g"
)

var newEmailSender = func(email string) (emailSender, error) {
	return mail_service.NewEmailSenderWithLocal(email)
}

type emailSender interface {
	GenerateMessageID() string
	Send(message mail_service.Message, recipients []string) error
	Close()
}

// Process delivers due welcome-email jobs. Individual delivery failures stay in the outbox.
func Process(ctx context.Context) error {
	config := LoadConfig(ctx)
	if !config.Enabled {
		return nil
	}

	for i := 0; i < batchSize; i++ {
		now := time.Now().UTC()
		job, err := claimJob(ctx, now)
		if err != nil {
			return fmt.Errorf("claim activation welcome job: %w", err)
		}
		if job == nil {
			return nil
		}

		if sendErr := deliver(ctx, *job, config); sendErr != nil {
			if err := markFailed(ctx, *job, sendErr, time.Now().UTC()); err != nil {
				return fmt.Errorf("record activation welcome failure: %w", err)
			}
			g.Log().Warning(ctx, "Activation welcome email delivery failed:", sendErr)
			continue
		}
		if err := markSent(ctx, *job, time.Now().UTC()); err != nil {
			return fmt.Errorf("record activation welcome success: %w", err)
		}
	}
	return nil
}

func deliver(ctx context.Context, job Job, config Config) error {
	senderAddress, _, err := ResolveSender(job.Email, config.Sender)
	if err != nil {
		return err
	}
	if err := ensureSystemMailbox(ctx, senderAddress); err != nil {
		return fmt.Errorf("prepare system sender mailbox: %w", err)
	}

	htmlPath, txtPath := templatePaths()
	htmlBody, _, err := renderTemplateFiles(ctx, job.Email, htmlPath, txtPath)
	if err != nil {
		return fmt.Errorf("render activation welcome template: %w", err)
	}

	sender, err := newEmailSender(senderAddress)
	if err != nil {
		return fmt.Errorf("create activation welcome sender: %w", err)
	}
	defer sender.Close()

	message := mail_service.NewMessage(config.Subject, htmlBody)
	message.SetMessageID(sender.GenerateMessageID())
	message.SetRealName("JesusMail")
	if err := sender.Send(message, []string{job.Email}); err != nil {
		return fmt.Errorf("send activation welcome email: %w", err)
	}
	return nil
}

func ensureSystemMailbox(ctx context.Context, address string) error {
	var existing struct {
		Username string `orm:"username"`
		Active   int    `orm:"active"`
	}
	if err := g.DB().Model("mailbox").Ctx(ctx).
		Fields("username,active").
		Where("username", address).
		Scan(&existing); err != nil {
		return fmt.Errorf("query system sender mailbox: %w", err)
	}
	if existing.Username != "" {
		if existing.Active != 1 {
			return fmt.Errorf("system sender mailbox %s is disabled", address)
		}
		return nil
	}

	recipient, domain, err := splitRecipient(address)
	if err != nil {
		return err
	}
	localPart := strings.SplitN(recipient, "@", 2)[0]
	domainCount, err := g.DB().Model("domain").Ctx(ctx).
		Where("domain", domain).
		WhereNot("active", 0).
		Count()
	if err != nil {
		return fmt.Errorf("check system sender domain: %w", err)
	}
	if domainCount == 0 {
		return fmt.Errorf("system sender domain %s is not active", domain)
	}

	mailbox := &mailboxv1.Mailbox{
		Username:    address,
		Password:    grand.S(24),
		FullName:    "JesusMail 系统发件邮箱",
		IsAdmin:     0,
		Quota:       5 * 1024 * 1024,
		LocalPart:   localPart,
		Domain:      domain,
		Active:      1,
		QuotaActive: 1,
		SourceType:  "system",
	}
	if err := mail_boxes.PrepareForInsert(ctx, mailbox); err != nil {
		return err
	}

	result, err := g.DB().Model("mailbox").Ctx(ctx).Data(mailbox).InsertIgnore()
	if err != nil {
		return fmt.Errorf("create system sender mailbox: %w", err)
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 1 {
		if storageErr := mail_boxes.EnsureStorage(ctx, mailbox); storageErr != nil {
			g.Log().Warning(ctx, "System sender mailbox storage initialization failed:", storageErr)
		}
	}
	return nil
}

func templatePaths() (htmlPath, txtPath string) {
	base := public.AbsPath("../core/template/activation_welcome_email")
	return strings.TrimRight(base, string(os.PathSeparator)) + string(os.PathSeparator) + "welcome_email.html",
		strings.TrimRight(base, string(os.PathSeparator)) + string(os.PathSeparator) + "welcome_email.txt"
}
