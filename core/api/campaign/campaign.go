// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package campaign

import (
	"context"

	"jesusmail-core/api/campaign/v1"
)

type ICampaignV1 interface {
	Form(ctx context.Context, req *v1.FormReq) (res *v1.FormRes, err error)
}
