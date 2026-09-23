package consts

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDeploymentValue(t *testing.T) {
	old, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	root := t.TempDir()
	if err := os.Mkdir(filepath.Join(root, "core"), 0700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, ".env"), []byte("# deployment\nJESUSMAIL_SERVICE_POSTFIX=mail-service\n"), 0600); err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(filepath.Join(root, "core")); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chdir(old) })
	if got := deploymentValue("JESUSMAIL_SERVICE_POSTFIX", "fallback"); got != "mail-service" {
		t.Fatalf("file override = %q", got)
	}
	t.Setenv("JESUSMAIL_SERVICE_POSTFIX", "process-service")
	if got := deploymentValue("JESUSMAIL_SERVICE_POSTFIX", "fallback"); got != "process-service" {
		t.Fatalf("process override = %q", got)
	}
	if got := deploymentValue("JESUSMAIL_SERVICE_REDIS", "fallback"); got != "fallback" {
		t.Fatalf("fallback = %q", got)
	}
}
