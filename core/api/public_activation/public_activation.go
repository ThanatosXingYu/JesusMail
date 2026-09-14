package public_activation

import (
	"billionmail-core/api/public_activation/v1"
	"context"
)

type IPublicActivationV1 interface {
	Activate(ctx context.Context, req *v1.ActivateReq) (res *v1.ActivateRes, err error)
}
