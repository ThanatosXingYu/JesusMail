package mail_boxes

import (
	"context"
	"errors"

	"jesusmail-core/api/mail_boxes/v1"
	service "jesusmail-core/internal/service/mail_boxes"

	"github.com/gogf/gf/v2/frame/g"
)

const (
	permanentDeleteConfirmation = "PERMANENTLY DELETE"
	purgeExpiredConfirmation    = "PURGE EXPIRED"
)

func (c *ControllerV1) RecycleStats(ctx context.Context, _ *v1.RecycleStatsReq) (*v1.RecycleStatsRes, error) {
	stats, err := service.GetRecycleStats(ctx)
	if err != nil {
		return nil, err
	}
	res := &v1.RecycleStatsRes{}
	res.SetSuccess("Success")
	res.Data = stats
	return res, nil
}

func (c *ControllerV1) RecycleList(ctx context.Context, req *v1.RecycleListReq) (*v1.RecycleListRes, error) {
	data, err := service.ListRecycleItems(ctx, req.Page, req.PageSize, req.Keyword, req.Status)
	if err != nil {
		return nil, err
	}
	res := &v1.RecycleListRes{}
	res.SetSuccess("Success")
	res.Data = data
	return res, nil
}

func (c *ControllerV1) RecycleRestore(ctx context.Context, req *v1.RecycleRestoreReq) (*v1.RecycleRestoreRes, error) {
	result, err := service.RestoreRecycleItems(ctx, req.Ids)
	if err != nil && result.Succeeded == 0 {
		return nil, err
	}
	res := &v1.RecycleRestoreRes{}
	res.SetSuccess("Restore completed")
	res.Data = g.Map{"restored": result.Succeeded, "failed": result.Failed}
	return res, nil
}

func (c *ControllerV1) RecyclePurge(ctx context.Context, req *v1.RecyclePurgeReq) (*v1.RecyclePurgeRes, error) {
	if req.Confirmation != permanentDeleteConfirmation {
		return nil, errors.New("permanent deletion confirmation does not match")
	}
	result, err := service.PurgeRecycleItems(ctx, req.Ids)
	if err != nil && result.Succeeded == 0 {
		return nil, err
	}
	res := &v1.RecyclePurgeRes{}
	res.SetSuccess("Permanent deletion completed")
	res.Data = g.Map{"purged": result.Succeeded, "failed": result.Failed}
	return res, nil
}

func (c *ControllerV1) RecycleCleanup(ctx context.Context, req *v1.RecycleCleanupReq) (*v1.RecycleCleanupRes, error) {
	if req.Confirmation != purgeExpiredConfirmation {
		return nil, errors.New("expired cleanup confirmation does not match")
	}
	result, err := service.CleanupExpiredRecycleItems(ctx, 100)
	if err != nil && result.Succeeded == 0 {
		return nil, err
	}
	res := &v1.RecycleCleanupRes{}
	res.SetSuccess("Expired recycle cleanup completed")
	res.Data = g.Map{"purged": result.Succeeded, "failed": result.Failed}
	return res, nil
}
