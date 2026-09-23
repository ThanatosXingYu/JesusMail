package mail_boxes

import (
	"context"
	"errors"
	"net/http"

	"jesusmail-core/api/mail_boxes/v1"
	mailboxservice "jesusmail-core/internal/service/mail_boxes"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

const roundcubeSSOSecretHeader = "X-JesusMail-Roundcube-SSO-Secret"

func (c *PublicControllerV1) ConsumeLoginTicket(ctx context.Context, req *v1.ConsumeLoginTicketReq) (res *v1.ConsumeLoginTicketRes, err error) {
	r := g.RequestFromCtx(ctx)
	if r == nil {
		return nil, errors.New("request context is unavailable")
	}
	r.Response.Header().Set("Cache-Control", "no-store")
	r.Response.Header().Set("Pragma", "no-cache")

	credential, consumeErr := mailboxservice.ConsumeLoginTicket(ctx, req.Ticket, r.Header.Get(roundcubeSSOSecretHeader))
	if consumeErr != nil {
		switch {
		case errors.Is(consumeErr, mailboxservice.ErrRoundcubeSSODisabled):
			writeLoginTicketError(r, http.StatusServiceUnavailable, "Roundcube SSO is unavailable")
		case errors.Is(consumeErr, mailboxservice.ErrRoundcubeSSOForbidden):
			writeLoginTicketError(r, http.StatusForbidden, "Forbidden")
		case errors.Is(consumeErr, mailboxservice.ErrLoginTicketInvalid):
			writeLoginTicketError(r, http.StatusUnauthorized, "Invalid or expired login ticket")
		case errors.Is(consumeErr, mailboxservice.ErrMailboxUnavailable):
			writeLoginTicketError(r, http.StatusGone, "Mailbox is unavailable")
		default:
			// Never log the request body, ticket, shared secret, mailbox password, or Core response.
			g.Log().Error(ctx, "consume Roundcube login ticket failed")
			writeLoginTicketError(r, http.StatusServiceUnavailable, "Roundcube SSO is unavailable")
		}
		return nil, nil
	}

	return &v1.ConsumeLoginTicketRes{
		Username: credential.Username,
		Password: credential.Password,
	}, nil
}

func writeLoginTicketError(r *ghttp.Request, status int, message string) {
	r.Response.WriteHeader(status)
	r.Response.WriteJson(g.Map{"error": message})
}
