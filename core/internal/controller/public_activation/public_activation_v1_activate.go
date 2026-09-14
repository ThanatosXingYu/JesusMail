package public_activation

import (
	"billionmail-core/api/public_activation/v1"
	"billionmail-core/internal/service/activation"
	"context"
	"errors"
	"net"
	"strings"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

func (c *ControllerV1) Activate(ctx context.Context, req *v1.ActivateReq) (res *v1.ActivateRes, err error) {
	res = &v1.ActivateRes{}
	ip := activationClientIP(g.RequestFromCtx(ctx))
	allowed, rateErr := activation.AllowAttempt(ctx, ip)
	if rateErr != nil {
		g.Log().Error(ctx, "public mailbox activation rate limit failed:", rateErr)
		res.Code = 503
		res.Msg = "服务暂时不可用，请稍后重试"
		return res, nil
	}
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

func activationClientIP(r *ghttp.Request) string {
	if r == nil {
		return "unknown"
	}
	return resolveActivationClientIP(r.GetRemoteIp(), r.Header.Get("X-Real-IP"), r.Header.Get("X-Forwarded-For"))
}

func resolveActivationClientIP(remote, realIP, forwardedFor string) string {
	peer := net.ParseIP(strings.TrimSpace(remote))
	if peer == nil {
		return "unknown"
	}

	// Forwarding headers are trusted only from an internal or loopback reverse proxy.
	if !peer.IsLoopback() && !peer.IsPrivate() {
		return peer.String()
	}

	if candidate := net.ParseIP(strings.TrimSpace(realIP)); candidate != nil {
		return candidate.String()
	}

	parts := strings.Split(forwardedFor, ",")
	for i := len(parts) - 1; i >= 0; i-- {
		if candidate := net.ParseIP(strings.TrimSpace(parts[i])); candidate != nil {
			return candidate.String()
		}
	}

	return peer.String()
}
