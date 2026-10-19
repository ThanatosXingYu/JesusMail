package v1

import "github.com/gogf/gf/v2/frame/g"

// DiagnoseLoginReq is called only by the Roundcube plugin over the internal network.
// It classifies a normal webmail login attempt so the browser can receive a useful message.
type DiagnoseLoginReq struct {
	g.Meta   `path:"/mailbox/login_diagnose" tags:"Public MailBox" method:"post" summary:"Diagnose a Roundcube login attempt" in:"body"`
	Username string `json:"username" v:"required|email|max-length:320" dc:"Mailbox email address"`
	Password string `json:"password" v:"required|max-length:256" dc:"Mailbox password"`
}

type LoginDiagnosis struct {
	Status  string `json:"status" dc:"ok, invalid_email, not_found, unavailable, wrong_password, or rate_limited"`
	Message string `json:"message" dc:"User-facing diagnostic message"`
}

type DiagnoseLoginRes struct {
	LoginDiagnosis
}
