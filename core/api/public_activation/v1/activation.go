package v1

import (
	api_v1 "jesusmail-core/utility/types/api_v1"
	"github.com/gogf/gf/v2/frame/g"
)

type ActivateReq struct {
	g.Meta   `path:"/activation/activate" tags:"Public Activation" method:"post" summary:"Activate a mailbox" in:"body"`
	Key      string `json:"key" v:"required|max-length:32"`
	Prefix   string `json:"prefix" v:"required|max-length:30"`
	Password string `json:"password" v:"required|max-length:64"`
	// DurationDays is accepted for backward compatibility with older clients and ignored:
	// mailboxes activated from an activation key are permanent.
	DurationDays int `json:"duration_days,omitempty"`
}

type ActivateRes struct{ api_v1.StandardRes }

type ConfigReq struct {
	g.Meta `path:"/activation/config" tags:"Public Activation" method:"get" summary:"Get public activation configuration" in:"query"`
}

type ConfigRes struct{ api_v1.StandardRes }
