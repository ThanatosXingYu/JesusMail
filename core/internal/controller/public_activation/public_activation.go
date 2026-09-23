package public_activation

import api "jesusmail-core/api/public_activation"

type ControllerV1 struct{}

func NewV1() api.IPublicActivationV1 { return &ControllerV1{} }
