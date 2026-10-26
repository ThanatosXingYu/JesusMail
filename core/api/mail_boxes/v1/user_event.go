package v1

import (
	"jesusmail-core/utility/types/api_v1"

	"github.com/gogf/gf/v2/frame/g"
)

// RecordUserEventReq is called only by the Roundcube plugin over the internal network.
type RecordUserEventReq struct {
	g.Meta    `path:"/mailbox/user_event" tags:"Public MailBox" method:"post" summary:"Record a mailbox user event" in:"body"`
	Username  string `json:"username" v:"required|email|max-length:320" dc:"Mailbox email address"`
	EventType string `json:"event_type" v:"required|in:login,logout" dc:"login or logout"`
	UserAgent string `json:"user_agent" v:"max-length:512" dc:"Browser user agent"`
	Detail    string `json:"detail" v:"max-length:512" dc:"Non-sensitive event detail"`
}

type RecordUserEventRes struct {
	api_v1.StandardRes
}
