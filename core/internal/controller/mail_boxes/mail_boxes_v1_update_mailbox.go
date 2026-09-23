package mail_boxes

import (
	"jesusmail-core/api/mail_boxes/v1"
	"jesusmail-core/internal/consts"
	"jesusmail-core/internal/service/mail_boxes"
	"jesusmail-core/internal/service/public"
	"context"
	"strings"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) UpdateMailbox(ctx context.Context, req *v1.UpdateMailboxReq) (res *v1.UpdateMailboxRes, err error) {
	res = &v1.UpdateMailboxRes{}
	req.FullName = strings.TrimSpace(req.FullName)
	req.LocalPart = strings.TrimSpace(req.LocalPart)
	mailbox := &v1.Mailbox{
		Username:    req.LocalPart + "@" + req.Domain,
		Password:    req.Password, // If empty, password won't be updated
		FullName:    req.FullName,
		IsAdmin:     req.IsAdmin,
		Quota:       int64(req.Quota),
		LocalPart:   req.LocalPart,
		Domain:      req.Domain,
		Active:      req.Active,
		QuotaActive: req.QuotaActive,
		ExpiresAt:   req.ExpiresAt,
	}
	if mailbox.FullName == "" {
		mailbox.FullName = req.LocalPart
	}
	expiresAtProvided := true
	if request := g.RequestFromCtx(ctx); request != nil {
		_, expiresAtProvided = request.GetRequestMap()["expires_at"]
	}
	if err = mail_boxes.Update(ctx, mailbox, expiresAtProvided); err != nil {
		return nil, err
	}

	_ = public.WriteLog(ctx, public.LogParams{
		Type: consts.LOGTYPE.Mailboxes,
		Log:  "Updated mailbox:" + mailbox.Username + " successfully",
		Data: mailbox,
	})
	res.SetSuccess("Mailbox updated successfully")
	return
}
