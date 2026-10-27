package mail_boxes

import (
	"context"
	"jesusmail-core/api/mail_boxes/v1"
	"jesusmail-core/internal/consts"
	"jesusmail-core/internal/service/mail_boxes"
	"jesusmail-core/internal/service/public"
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
	if req.RecoveryEmail != nil {
		mailbox.RecoveryEmail = strings.TrimSpace(*req.RecoveryEmail)
	}
	expiresAtProvided := true
	recoveryEmailProvided := false
	if request := g.RequestFromCtx(ctx); request != nil {
		requestMap := request.GetRequestMap()
		_, expiresAtProvided = requestMap["expires_at"]
		_, recoveryEmailProvided = requestMap["recovery_email"]
	}
	if err = mail_boxes.Update(ctx, mailbox, expiresAtProvided, recoveryEmailProvided); err != nil {
		return nil, err
	}

	_ = public.WriteLog(ctx, public.LogParams{
		Type: consts.LOGTYPE.Mailboxes,
		Log:  "Updated mailbox:" + mailbox.Username + " successfully",
		Data: mailbox,
	})
	res.SetSuccess("邮箱更新成功")
	return
}
