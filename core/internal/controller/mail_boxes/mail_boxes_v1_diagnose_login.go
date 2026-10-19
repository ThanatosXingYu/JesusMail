package mail_boxes

import (
	"context"
	"crypto/hmac"
	"errors"
	"net"
	"net/http"
	"strings"

	"jesusmail-core/api/mail_boxes/v1"
	mailboxservice "jesusmail-core/internal/service/mail_boxes"

	"github.com/gogf/gf/v2/frame/g"
)

const roundcubeClientIPHeader = "X-JesusMail-Client-IP"

func (c *PublicControllerV1) DiagnoseLogin(ctx context.Context, req *v1.DiagnoseLoginReq) (*v1.DiagnoseLoginRes, error) {
	r := g.RequestFromCtx(ctx)
	if r == nil {
		return nil, errors.New("request context is unavailable")
	}
	r.Response.Header().Set("Cache-Control", "no-store")
	r.Response.Header().Set("Pragma", "no-cache")

	expectedSecret := mailboxservice.RoundcubeSSOSecret()
	if expectedSecret == "" {
		writeLoginTicketError(r, http.StatusServiceUnavailable, "Roundcube login diagnostics are unavailable")
		return nil, nil
	}
	providedSecret := r.Header.Get(roundcubeSSOSecretHeader)
	if !hmac.Equal([]byte(providedSecret), []byte(expectedSecret)) {
		writeLoginTicketError(r, http.StatusForbidden, "Forbidden")
		return nil, nil
	}

	clientIP := trustedRoundcubeClientIP(r.Header.Get(roundcubeClientIPHeader))
	diagnosis, err := mailboxservice.DiagnoseLogin(ctx, req.Username, req.Password, clientIP)
	if err != nil {
		// Do not log the username or password from the diagnostic request.
		g.Log().Error(ctx, "diagnose Roundcube login failed")
		writeLoginTicketError(r, http.StatusServiceUnavailable, "Roundcube login diagnostics are unavailable")
		return nil, nil
	}

	res := &v1.DiagnoseLoginRes{LoginDiagnosis: v1.LoginDiagnosis{
		Status:  diagnosis.Status,
		Message: diagnosis.Message,
	}}
	return res, nil
}

func trustedRoundcubeClientIP(value string) string {
	if ip := net.ParseIP(strings.TrimSpace(value)); ip != nil {
		return ip.String()
	}
	return "unknown"
}
