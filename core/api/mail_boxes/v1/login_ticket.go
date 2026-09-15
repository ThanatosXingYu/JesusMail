package v1

import (
	"billionmail-core/utility/types/api_v1"

	"github.com/gogf/gf/v2/frame/g"
)

// CreateLoginTicketReq creates a short-lived, single-use Roundcube login ticket.
type CreateLoginTicketReq struct {
	g.Meta        `path:"/mailbox/login_ticket" tags:"MailBox" method:"post" summary:"Create a Roundcube login ticket" in:"body"`
	Authorization string `json:"authorization" dc:"Authorization" in:"header"`
	Username      string `json:"username" v:"required|email|max-length:320" dc:"Mailbox username"`
}

// CreateLoginTicketRes returns only an opaque ticket to the authenticated administrator.
type CreateLoginTicketRes struct {
	api_v1.StandardRes
}

// LoginTicketData is safe to return to the browser. It never contains a mailbox password.
type LoginTicketData struct {
	Ticket    string `json:"ticket"`
	ExpiresIn int64  `json:"expires_in"`
}

// ConsumeLoginTicketReq is called only by the Roundcube plugin over the internal network.
type ConsumeLoginTicketReq struct {
	g.Meta `path:"/mailbox/login_ticket/consume" tags:"Public MailBox" method:"post" summary:"Consume a Roundcube login ticket" in:"body"`
	Ticket string `json:"ticket" v:"required|min-length:43|max-length:43|regex:^[A-Za-z0-9_-]+$" dc:"Single-use login ticket"`
}

// ConsumeLoginTicketRes deliberately contains only the credentials Roundcube needs server-side.
type ConsumeLoginTicketRes struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
