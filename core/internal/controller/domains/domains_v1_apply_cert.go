package domains

import (
	"jesusmail-core/internal/consts"
	"jesusmail-core/internal/service/domains"
	"jesusmail-core/internal/service/public"
	"jesusmail-core/internal/service/rbac"
	"context"

	"jesusmail-core/api/domains/v1"
)

func (c *ControllerV1) ApplyCert(ctx context.Context, req *v1.ApplyCertReq) (res *v1.ApplyCertRes, err error) {
	res = &v1.ApplyCertRes{}

	acc, err := rbac.GetCurrentAccount(ctx)

	if err != nil {
		res.SetError(err)
		return
	}

	// Apply for the certificate
	err = domains.ApplyLetsEncryptCertWithHttp(ctx, req.Domain, acc)

	if err != nil {
		res.SetError(err)
		return
	}

	_ = public.WriteLog(ctx, public.LogParams{
		Type: consts.LOGTYPE.Domain,
		Log:  "Apply certificate for domain :" + req.Domain + " successfully",
		Data: req.Domain,
	})

	res.SetSuccess("Certificate applied successfully")
	return
}
