package mail_boxes

import (
	"context"
	"errors"
	"time"

	"jesusmail-core/api/mail_boxes/v1"
	mailboxmessages "jesusmail-core/internal/service/mailbox_messages"
	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) GetUserMessages(ctx context.Context, req *v1.GetUserMessagesReq) (*v1.GetUserMessagesRes, error) {
	total, list, err := mailboxmessages.List(ctx, mailboxmessages.Filter{
		Page:      req.Page,
		PageSize:  req.PageSize,
		Direction: req.Direction,
		Keyword:   req.Keyword,
		Mailbox:   req.Mailbox,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
	})
	if err != nil {
		if errors.Is(err, mailboxmessages.ErrInvalidFilter) {
			return nil, gerror.NewCode(gcode.CodeValidationFailed, "invalid mail message filter")
		}
		return nil, err
	}

	res := &v1.GetUserMessagesRes{}
	res.Data.Total = total
	res.Data.List = make([]v1.UserMessage, 0, len(list))
	for _, item := range list {
		res.Data.List = append(res.Data.List, v1.UserMessage{
			ID:              item.ID,
			MailboxUsername: item.MailboxUsername,
			Direction:       item.Direction,
			Folder:          item.Folder,
			MessageID:       item.MessageID,
			Sender:          item.Sender,
			Recipients:      item.Recipients,
			Subject:         item.Subject,
			SentAt:          item.SentAt,
			BodyPreview:     item.BodyPreview,
		})
	}
	res.SetSuccess(public.LangCtx(ctx, "Get user messages successfully"))
	return res, nil
}

func (c *ControllerV1) ReindexUserMessages(ctx context.Context, _ *v1.ReindexUserMessagesReq) (*v1.ReindexUserMessagesRes, error) {
	scanCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Minute)
	defer cancel()
	result, err := mailboxmessages.Scan(scanCtx)
	if err != nil {
		if errors.Is(err, mailboxmessages.ErrScanInProgress) {
			return nil, gerror.NewCode(gcode.CodeValidationFailed, "mail index scan is already running")
		}
		g.Log().Error(ctx, "reindex mailbox messages failed:", err)
		return nil, gerror.NewCode(gcode.CodeInternalError, "reindex mailbox messages failed")
	}
	res := &v1.ReindexUserMessagesRes{}
	res.Data.Scanned = result.Scanned
	res.Data.Indexed = result.Indexed
	res.Data.Removed = result.Removed
	res.Data.Failed = result.Failed
	res.SetSuccess(public.LangCtx(ctx, "Mail message index refreshed successfully"))
	return res, nil
}
