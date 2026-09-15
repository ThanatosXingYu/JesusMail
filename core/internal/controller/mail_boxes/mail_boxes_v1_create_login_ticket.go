package mail_boxes

import (
	"context"
	"errors"

	"billionmail-core/api/mail_boxes/v1"
	mailboxservice "billionmail-core/internal/service/mail_boxes"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) CreateLoginTicket(ctx context.Context, req *v1.CreateLoginTicketReq) (res *v1.CreateLoginTicketRes, err error) {
	res = &v1.CreateLoginTicketRes{}

	ticket, err := mailboxservice.CreateLoginTicket(ctx, req.Username)
	if err != nil {
		if errors.Is(err, mailboxservice.ErrMailboxUnavailable) {
			res.Code = 422
			res.Msg = "Mailbox does not exist, is inactive, or is expired"
			return res, nil
		}
		if errors.Is(err, mailboxservice.ErrRoundcubeSSODisabled) {
			res.Code = 503
			res.Msg = "Roundcube SSO is unavailable"
			return res, nil
		}
		g.Log().Error(ctx, "create Roundcube login ticket failed")
		res.Code = 503
		res.Msg = "Unable to create login ticket"
		return res, nil
	}

	res.SetSuccess("Login ticket created")
	res.Data = v1.LoginTicketData{
		Ticket:    ticket.Token,
		ExpiresIn: ticket.ExpiresIn,
	}
	return res, nil
}
