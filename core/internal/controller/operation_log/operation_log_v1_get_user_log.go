package operation_log

import (
	"context"
	"errors"

	"jesusmail-core/api/operation_log/v1"
	operationlogservice "jesusmail-core/internal/service/operation_log"
	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

func (c *ControllerV1) GetUserLog(ctx context.Context, req *v1.GetUserLogReq) (*v1.GetUserLogRes, error) {
	total, list, err := operationlogservice.ListUserLogs(ctx, operationlogservice.UserLogFilter{
		Page:      req.Page,
		PageSize:  req.PageSize,
		Username:  req.Username,
		EventType: req.EventType,
		Keyword:   req.Keyword,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
	})
	if err != nil {
		if errors.Is(err, operationlogservice.ErrInvalidUserLogFilter) {
			return nil, gerror.NewCode(gcode.CodeValidationFailed, "invalid mailbox user log filter")
		}
		return nil, err
	}

	res := &v1.GetUserLogRes{}
	res.Data.Total = total
	res.Data.List = list
	res.SetSuccess(public.LangCtx(ctx, "Get mailbox user logs successfully"))
	return res, nil
}
