package mail_boxes

import (
	"context"
	"crypto/hmac"
	"errors"
	"net/http"

	"jesusmail-core/api/mail_boxes/v1"
	mailboxservice "jesusmail-core/internal/service/mail_boxes"
	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *PublicControllerV1) RecordUserEvent(ctx context.Context, req *v1.RecordUserEventReq) (*v1.RecordUserEventRes, error) {
	r := g.RequestFromCtx(ctx)
	if r == nil {
		return nil, errors.New("request context is unavailable")
	}
	r.Response.Header().Set("Cache-Control", "no-store")
	r.Response.Header().Set("Pragma", "no-cache")

	expectedSecret := mailboxservice.RoundcubeSSOSecret()
	if expectedSecret == "" {
		writeLoginTicketError(r, http.StatusServiceUnavailable, "Mailbox user event logging is unavailable")
		return nil, nil
	}
	if !hmac.Equal([]byte(r.Header.Get(roundcubeSSOSecretHeader)), []byte(expectedSecret)) {
		writeLoginTicketError(r, http.StatusForbidden, "Forbidden")
		return nil, nil
	}

	err := mailboxservice.RecordMailboxUserEvent(ctx, mailboxservice.MailboxUserEvent{
		Username:  req.Username,
		EventType: req.EventType,
		IP:        trustedRoundcubeClientIP(r.Header.Get(roundcubeClientIPHeader)),
		UserAgent: req.UserAgent,
		Detail:    req.Detail,
	})
	if err != nil {
		if errors.Is(err, mailboxservice.ErrInvalidMailboxUserEvent) {
			writeLoginTicketError(r, http.StatusBadRequest, "Invalid mailbox user event")
			return nil, nil
		}
		// Event metadata is intentionally omitted from logs.
		g.Log().Error(ctx, "record mailbox user event failed")
		writeLoginTicketError(r, http.StatusServiceUnavailable, "Mailbox user event logging is unavailable")
		return nil, nil
	}

	res := &v1.RecordUserEventRes{}
	res.SetSuccess(public.LangCtx(ctx, "Mailbox user event recorded successfully"))
	return res, nil
}
