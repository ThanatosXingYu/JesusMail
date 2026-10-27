package email_template

import (
	"context"
	"jesusmail-core/internal/consts"
	"jesusmail-core/internal/service/email_template"
	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/errors/gerror"

	"jesusmail-core/api/email_template/v1"
)

func (c *ControllerV1) DeleteTemplate(ctx context.Context, req *v1.DeleteTemplateReq) (res *v1.DeleteTemplateRes, err error) {
	res = &v1.DeleteTemplateRes{}

	template, _ := email_template.GetTemplate(ctx, req.Id)
	if template == nil || template.Id == 0 {
		res.Code = 404
		res.SetError(gerror.New("模板不存在"))
		return
	}
	if template.SystemKey != "" {
		res.Code = 400
		res.SetError(gerror.New("系统模板不能删除"))
		return
	}

	err = email_template.DeleteTemplate(ctx, req.Id)
	if err != nil {
		res.Code = 500
		res.SetError(gerror.New("删除模板失败"))
		return
	}

	_ = public.WriteLog(ctx, public.LogParams{
		Type: consts.LOGTYPE.Template,
		Log:  "Delete template :" + template.TempName + " successfully",
		Data: template,
	})

	res.SetSuccess(public.LangCtx(ctx, "Template deleted successfully"))
	return
}
