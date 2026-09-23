package mail_boxes

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/frame/g"
)

// MailStats counts successful, distinct log records currently retained for a mailbox.
// These are not lifetime totals: logs may be pruned, and the underlying tables retain
// one record per Postfix queue ID (not one record per recipient of a multi-recipient mail).
type MailStats struct {
	Sent     int64
	Received int64
}

type mailStatRow struct {
	Username string `orm:"username"`
	Count    int64  `orm:"count"`
}

// GetMailStats returns aggregate mail-log counts for just the requested page of mailboxes.
// All mailbox addresses are bound by the database driver; no address is interpolated in SQL.
func GetMailStats(ctx context.Context, usernames []string) (map[string]MailStats, error) {
	stats := make(map[string]MailStats, len(usernames))
	if len(usernames) == 0 {
		return stats, nil
	}

	var sent []mailStatRow
	err := g.DB().Model("mailstat_senders s").Ctx(ctx).
		InnerJoin("mailstat_send_mails sm", "sm.postfix_message_id = s.postfix_message_id").
		WhereIn("s.sender", usernames).
		Where("sm.status = ? AND sm.dsn LIKE ?", "sent", "2.%").
		Fields("s.sender AS username, COUNT(*) AS count").Group("s.sender").Scan(&sent)
	if err != nil {
		return nil, fmt.Errorf("count successfully sent mail records: %w", err)
	}
	for _, row := range sent {
		item := stats[row.Username]
		item.Sent = row.Count
		stats[row.Username] = item
	}

	var received []mailStatRow
	err = g.DB().Model("mailstat_receive_mails rm").Ctx(ctx).
		WhereIn("rm.recipient", usernames).
		Where("rm.status = ? AND rm.dsn LIKE ?", "sent", "2.%").
		Fields("rm.recipient AS username, COUNT(*) AS count").Group("rm.recipient").Scan(&received)
	if err != nil {
		return nil, fmt.Errorf("count successfully received mail records: %w", err)
	}
	for _, row := range received {
		item := stats[row.Username]
		item.Received = row.Count
		stats[row.Username] = item
	}
	return stats, nil
}
