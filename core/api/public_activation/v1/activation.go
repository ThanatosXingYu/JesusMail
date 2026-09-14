package v1

import (
	api_v1 "billionmail-core/utility/types/api_v1"
	"github.com/gogf/gf/v2/frame/g"
)

type ActivateReq struct {
	g.Meta   `path:"/activation/activate" tags:"Public Activation" method:"post" summary:"Activate a mailbox" in:"body"`
	Key      string `json:"key" v:"required|max-length:32"`
	Prefix   string `json:"prefix" v:"required|max-length:30"`
	Password string `json:"password" v:"required|max-length:64"`
}
type ActivateRes struct{ api_v1.StandardRes }
