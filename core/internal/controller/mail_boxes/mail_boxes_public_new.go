package mail_boxes

import api "billionmail-core/api/mail_boxes"

type PublicControllerV1 struct{}

// NewPublicV1 returns the shared-secret authenticated controller intended for /api/public.
func NewPublicV1() api.IPublicMailBoxesV1 {
	return &PublicControllerV1{}
}
