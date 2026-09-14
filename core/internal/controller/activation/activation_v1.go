package activation

import (
	"billionmail-core/api/activation/v1"
	service "billionmail-core/internal/service/activation"
	"context"
	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) Stats(ctx context.Context, req *v1.StatsReq) (*v1.StatsRes, error) {
	data, err := service.GetStats(ctx)
	if err != nil {
		return nil, err
	}
	res := &v1.StatsRes{}
	res.SetSuccess("Success")
	res.Data = data
	return res, nil
}
func (c *ControllerV1) List(ctx context.Context, req *v1.ListReq) (*v1.ListRes, error) {
	data, err := service.List(ctx, req.Page, req.PageSize, req.Status, req.Group)
	if err != nil {
		return nil, err
	}
	res := &v1.ListRes{}
	res.SetSuccess("Success")
	res.Data = data
	return res, nil
}
func (c *ControllerV1) Generate(ctx context.Context, req *v1.GenerateReq) (*v1.GenerateRes, error) {
	n, err := service.Generate(ctx, req.Count, req.Note, req.Group)
	if err != nil {
		return nil, err
	}
	res := &v1.GenerateRes{}
	res.SetSuccess("激活码生成成功")
	res.Data = g.Map{"created": n}
	return res, nil
}
func (c *ControllerV1) SetGroup(ctx context.Context, req *v1.SetGroupReq) (*v1.SetGroupRes, error) {
	n, err := service.SetGroup(ctx, req.Ids, req.Group)
	if err != nil {
		return nil, err
	}
	res := &v1.SetGroupRes{}
	res.SetSuccess("分组更新成功")
	res.Data = g.Map{"updated": n}
	return res, nil
}
func (c *ControllerV1) Delete(ctx context.Context, req *v1.DeleteReq) (*v1.DeleteRes, error) {
	d, s, err := service.Delete(ctx, req.Ids, req.Force)
	if err != nil {
		return nil, err
	}
	res := &v1.DeleteRes{}
	res.SetSuccess("删除完成")
	res.Data = g.Map{"deleted": d, "skipped_used": s}
	return res, nil
}
