package v1

import (
	api_v1 "billionmail-core/utility/types/api_v1"
	"github.com/gogf/gf/v2/frame/g"
)

type StatsReq struct {
	g.Meta `path:"/activation/stats" tags:"Activation" method:"get" summary:"Activation statistics"`
}
type StatsRes struct{ api_v1.StandardRes }
type ListReq struct {
	g.Meta   `path:"/activation/list" tags:"Activation" method:"get" summary:"List activation keys"`
	Page     int    `json:"page" d:"1" v:"min:1"`
	PageSize int    `json:"page_size" d:"50" v:"min:5|max:500"`
	Status   int    `json:"status" d:"-1" v:"min:-1|max:2"`
	Group    string `json:"group" v:"max-length:100"`
}
type ListRes struct{ api_v1.StandardRes }
type GenerateReq struct {
	g.Meta `path:"/activation/generate" tags:"Activation" method:"post" summary:"Generate activation keys"`
	Count  int    `json:"count" v:"required|min:1|max:500"`
	Note   string `json:"note" v:"max-length:255"`
	Group  string `json:"group" v:"max-length:100"`
}
type GenerateRes struct{ api_v1.StandardRes }
type SetGroupReq struct {
	g.Meta `path:"/activation/set_group" tags:"Activation" method:"post" summary:"Set activation key group"`
	Ids    []int64 `json:"ids" v:"required|length:1,500"`
	Group  string  `json:"group" v:"max-length:100"`
}
type SetGroupRes struct{ api_v1.StandardRes }
type DeleteReq struct {
	g.Meta `path:"/activation/delete" tags:"Activation" method:"post" summary:"Delete activation keys"`
	Ids    []int64 `json:"ids" v:"required|length:1,500"`
	Force  bool    `json:"force"`
}
type DeleteRes struct{ api_v1.StandardRes }
