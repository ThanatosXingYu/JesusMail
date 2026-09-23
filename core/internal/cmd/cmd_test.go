package cmd

import (
	"fmt"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/gogf/gf/v2/frame/g"
)

func TestIsPublicActivationPath(t *testing.T) {
	tests := []struct {
		path string
		want bool
	}{
		{path: "/activate", want: true},
		{path: "/activate/", want: true},
		{path: "/api/public/activation/activate", want: true},
		{path: "/api/public/activation/config", want: true},
		{path: "/public/activation/activate", want: true},
		{path: "/public/activation/config", want: true},
		{path: "/api/public/mailbox/login_ticket/consume", want: true},
		{path: "/static/js/index.js", want: true},
		{path: "/api/activation/list", want: false},
		{path: "/mailbox", want: false},
		{path: "/activate/extra", want: false},
		{path: "/api/public/activation/activate/extra", want: false},
		{path: "/public/activation/activate/extra", want: false},
		{path: "/api/public/mailbox/login_ticket/consume/extra", want: false},
	}

	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			if got := isPublicActivationPath(tt.path); got != tt.want {
				t.Fatalf("isPublicActivationPath(%q) = %v, want %v", tt.path, got, tt.want)
			}
		})
	}
}

func TestPublicAPIBindsProtectedRoundcubeTicketConsumer(t *testing.T) {
	t.Setenv("JESUSMAIL_ROUNDCUBE_SSO_SECRET", "route-test-shared-secret")
	t.Setenv("JESSUSMAIL_ROUNDCUBE_SSO_SECRET", "")

	server := g.Server(fmt.Sprintf("cmd-public-sso-%d", time.Now().UnixNano()))
	server.SetAddr("127.0.0.1:0")
	server.SetDumpRouterMap(false)
	server.SetAccessLogEnabled(false)
	server.SetErrorLogEnabled(false)
	server.Group("/api/public", bindPublicAPI)
	if err := server.Start(); err != nil {
		t.Fatalf("start test server: %v", err)
	}
	t.Cleanup(func() {
		if err := server.Shutdown(); err != nil {
			t.Errorf("shutdown test server: %v", err)
		}
	})

	const routePath = "/api/public/mailbox/login_ticket/consume"
	foundRoute := false
	for _, route := range server.GetRoutes() {
		if route.Route == routePath && strings.EqualFold(route.Method, http.MethodPost) && route.IsServiceHandler {
			foundRoute = true
			break
		}
	}
	if !foundRoute {
		t.Fatalf("POST %s was not registered", routePath)
	}

	request, err := http.NewRequest(
		http.MethodPost,
		fmt.Sprintf("http://127.0.0.1:%d%s", server.GetListenedPort(), routePath),
		strings.NewReader(`{"ticket":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}`),
	)
	if err != nil {
		t.Fatalf("create request: %v", err)
	}
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 2 * time.Second}
	response, err := client.Do(request)
	if err != nil {
		t.Fatalf("call public ticket consumer: %v", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(io.LimitReader(response.Body, 8192))
	if err != nil {
		t.Fatalf("read response: %v", err)
	}
	if response.StatusCode != http.StatusForbidden {
		t.Fatalf("ticket consumer without shared secret returned %d, want %d; body=%s", response.StatusCode, http.StatusForbidden, body)
	}
	if strings.Contains(strings.ToLower(string(body)), "password") {
		t.Fatalf("error response must not contain mailbox credentials: %s", body)
	}
}

func TestPublicActivationRoutesAreRegisteredWithoutAPIPrefix(t *testing.T) {
	server := g.Server(fmt.Sprintf("cmd-public-activation-%d", time.Now().UnixNano()))
	server.SetAddr("127.0.0.1:0")
	server.SetDumpRouterMap(false)
	server.SetAccessLogEnabled(false)
	server.SetErrorLogEnabled(false)
	server.Group("/api/public", bindPublicAPI)
	server.Group("/public", bindPublicActivationAPI)
	if err := server.Start(); err != nil {
		t.Fatalf("start test server: %v", err)
	}
	t.Cleanup(func() {
		if err := server.Shutdown(); err != nil {
			t.Errorf("shutdown test server: %v", err)
		}
	})

	expected := map[string]string{
		"/api/public/activation/activate": http.MethodPost,
		"/public/activation/activate":     http.MethodPost,
		"/api/public/activation/config":   http.MethodGet,
		"/public/activation/config":       http.MethodGet,
	}

	for routePath, method := range expected {
		foundRoute := false
		for _, route := range server.GetRoutes() {
			if route.Route == routePath && strings.EqualFold(route.Method, method) && route.IsServiceHandler {
				foundRoute = true
				break
			}
		}
		if !foundRoute {
			t.Fatalf("%s %s was not registered", method, routePath)
		}
	}

	client := &http.Client{Timeout: 2 * time.Second}
	response, err := client.Get(fmt.Sprintf("http://127.0.0.1:%d/public/activation/config", server.GetListenedPort()))
	if err != nil {
		t.Fatalf("call public activation config: %v", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(io.LimitReader(response.Body, 8192))
	if err != nil {
		t.Fatalf("read response: %v", err)
	}
	if response.StatusCode != http.StatusOK {
		t.Fatalf("public activation config returned %d, want %d; body=%s", response.StatusCode, http.StatusOK, body)
	}
	if !strings.Contains(string(body), "domain") || !strings.Contains(string(body), "quota") {
		t.Fatalf("public activation config response is missing configuration fields: %s", body)
	}
}

func TestExcludedURIsCoverEveryPublicActivationPath(t *testing.T) {
	excludes := excludedSafePathURIs()
	for _, path := range publicActivationAPIPaths {
		if _, ok := excludes[path]; !ok {
			t.Fatalf("safe path gate does not exclude public activation path %q", path)
		}
	}
}
