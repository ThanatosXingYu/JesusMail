package overview

import (
	"context"
	"fmt"

	"jesusmail-core/api/overview/v1"
	"jesusmail-core/internal/service/maillog_stat"
	"jesusmail-core/internal/service/public"
)

func (c *ControllerV1) MailboxStats(ctx context.Context, req *v1.MailboxStatsReq) (*v1.MailboxStatsRes, error) {
	stats, err := maillog_stat.GetMailboxStats(ctx, req.Domain)
	if err != nil {
		return nil, fmt.Errorf("get mailbox overview: %w", err)
	}
	res := &v1.MailboxStatsRes{}
	res.Data.Mailboxes = stats.Mailboxes
	res.Data.ActiveMailboxes = stats.ActiveMailboxes
	res.Data.Sent = stats.Sent
	res.Data.Received = stats.Received
	res.SetSuccess(public.LangCtx(ctx, "Success"))
	return res, nil
}
