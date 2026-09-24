package maillog_stat

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/frame/g"
)

// MailboxStats counts existing mailboxes and their successfully processed mail logs.
// Log counts are not lifetime totals: log retention and mailbox deletion change them.
type MailboxStats struct {
	Mailboxes       int64 `json:"mailboxes"`
	ActiveMailboxes int64 `json:"active_mailboxes"`
	Sent            int64 `json:"sent"`
	Received        int64 `json:"received"`
}

// GetMailboxStats aggregates across every existing mailbox, optionally within a domain.
// Unlike campaign analytics, these totals do not depend on the selected date range.
func GetMailboxStats(ctx context.Context, domain string) (MailboxStats, error) {
	var stats MailboxStats
	mailboxes := g.DB().Model("mailbox m").Ctx(ctx)
	if domain != "" {
		mailboxes = mailboxes.Where("m.domain = ?", domain)
	}
	row, err := mailboxes.Fields("COUNT(*) AS mailboxes, COALESCE(SUM(CASE WHEN m.active = 1 THEN 1 ELSE 0 END), 0) AS active_mailboxes").One()
	if err != nil {
		return stats, fmt.Errorf("count mailboxes: %w", err)
	}
	stats.Mailboxes = row["mailboxes"].Int64()
	stats.ActiveMailboxes = row["active_mailboxes"].Int64()

	sent := g.DB().Model("mailstat_send_mails sm").Ctx(ctx).
		InnerJoin("mailstat_senders s", "s.postfix_message_id = sm.postfix_message_id").
		InnerJoin("mailbox m", "LOWER(m.username) = LOWER(s.sender)").
		Where("sm.status = ? AND sm.dsn LIKE ?", "sent", "2.%")
	if domain != "" {
		sent = sent.Where("m.domain = ?", domain)
	}
	sentCount, err := sent.Count()
	if err != nil {
		return MailboxStats{}, fmt.Errorf("count successfully sent mail records: %w", err)
	}

	stats.Sent = int64(sentCount)

	received := g.DB().Model("mailstat_receive_mails rm").Ctx(ctx).
		InnerJoin("mailbox m", "LOWER(m.username) = LOWER(rm.recipient)").
		Where("rm.status = ? AND rm.dsn LIKE ?", "sent", "2.%")
	if domain != "" {
		received = received.Where("m.domain = ?", domain)
	}
	receivedCount, err := received.Count()
	if err != nil {
		return MailboxStats{}, fmt.Errorf("count successfully received mail records: %w", err)
	}
	stats.Received = int64(receivedCount)
	return stats, nil
}
