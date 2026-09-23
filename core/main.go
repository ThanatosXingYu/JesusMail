package main

import (
	_ "jesusmail-core/internal/packed"
	_ "github.com/gogf/gf/contrib/drivers/pgsql/v2"
	_ "github.com/gogf/gf/contrib/nosql/redis/v2"
	"github.com/gogf/gf/v2/os/gctx"

	"jesusmail-core/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
