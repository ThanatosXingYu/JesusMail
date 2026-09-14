package activation

import api "billionmail-core/api/activation"

type ControllerV1 struct{}

func NewV1() api.IActivationV1 { return &ControllerV1{} }
