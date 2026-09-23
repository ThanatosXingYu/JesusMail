package main

import (
	"jesusmail-core/internal/service/acme"
	"os"
)

func main() {
	// Run ACME CLI with command line arguments
	exitCode := acme.RunCLI(os.Args[1:])
	os.Exit(exitCode)
}
