package public_activation

import (
	"billionmail-core/api/public_activation/v1"
	"billionmail-core/internal/service/activation"
	"context"
	"errors"
	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) Activate(ctx context.Context, req *v1.ActivateReq) (res *v1.ActivateRes, err error) {
	res = &v1.ActivateRes{}
	r := g.RequestFromCtx(ctx)
	ip := ""
	if r != nil {
		ip = r.GetClientIp()
	}
	allowed, _ := activation.AllowAttempt(ctx, ip)
	if !allowed {
		res.Code = 429
		res.Msg = "尝试次数过多，请 10 分钟后再试"
		return res, nil
	}
	email, err := activation.Activate(ctx, req.Key, req.Prefix, req.Password, ip)
	if err != nil {
		res.Code = 422
		switch {
		case errors.Is(err, activation.ErrInvalidKey), errors.Is(err, activation.ErrMailboxExists):
			res.Msg = err.Error()
		default:
			g.Log().Error(ctx, "public mailbox activation failed:", err)
			res.Msg = "激活失败，请检查输入或稍后重试"
		}
		return res, nil
	}
	res.SetSuccess("邮箱激活成功")
	res.Data = g.Map{"email": email, "webmail_url": "/roundcube/", "domain": activation.Domain()}
	return res, nil
}
