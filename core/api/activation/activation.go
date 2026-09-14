package activation

import (
	"billionmail-core/api/activation/v1"
	"context"
)

type IActivationV1 interface {
	Stats(context.Context, *v1.StatsReq) (*v1.StatsRes, error)
	List(context.Context, *v1.ListReq) (*v1.ListRes, error)
	Generate(context.Context, *v1.GenerateReq) (*v1.GenerateRes, error)
	SetGroup(context.Context, *v1.SetGroupReq) (*v1.SetGroupRes, error)
	Delete(context.Context, *v1.DeleteReq) (*v1.DeleteRes, error)
}
