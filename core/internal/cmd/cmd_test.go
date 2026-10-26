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
		{path: "/api/public/mailbox/user_event", want: true},
		{path: "/static/js/index.js", want: true},
		{path: "/api/activation/list", want: false},
		{path: "/mailbox", want: false},
		{path: "/activate/extra", want: false},
		{path: "/api/public/activation/activate/extra", want: false},
		{path: "/public/activation/activate/extra", want: false},
		{path: "/api/public/mailbox/login_ticket/consume/extra", want: false},
		{path: "/api/public/mailbox/user_event/extra", want: false},
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

	routeRequests := map[string]string{
		"/api/public/mailbox/login_ticket/consume": `{"ticket":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}`,
		"/api/public/mailbox/user_event":           `{"username":"user@example.com","event_type":"login"}`,
	}
	for routePath := range routeRequests {
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
	}

	client := &http.Client{Timeout: 2 * time.Second}
	for routePath, requestBody := range routeRequests {
		request, err := http.NewRequest(
			http.MethodPost,
			fmt.Sprintf("http://127.0.0.1:%d%s", server.GetListenedPort(), routePath),
			strings.NewReader(requestBody),
		)
		if err != nil {
			t.Fatalf("create request for %s: %v", routePath, err)
		}
		request.Header.Set("Content-Type", "application/json")

		response, err := client.Do(request)
		if err != nil {
			t.Fatalf("call protected public endpoint %s: %v", routePath, err)
		}

		body, readErr := io.ReadAll(io.LimitReader(response.Body, 8192))
		response.Body.Close()
		if readErr != nil {
			t.Fatalf("read response for %s: %v", routePath, readErr)
		}
		if response.StatusCode != http.StatusForbidden {
			t.Fatalf("%s without shared secret returned %d, want %d; body=%s", routePath, response.StatusCode, http.StatusForbidden, body)
		}
		if strings.Contains(strings.ToLower(string(body)), "password") {
			t.Fatalf("error response must not contain mailbox credentials: %s", body)
		}
	}

	request, err := http.NewRequest(
		http.MethodPost,
		fmt.Sprintf("http://127.0.0.1:%d/api/public/mailbox/user_event", server.GetListenedPort()),
		strings.NewReader(`{"username":"invalid","event_type":"unknown"}`),
	)
	if err != nil {
		t.Fatalf("create malformed unauthenticated user event request: %v", err)
	}
	request.Header.Set("Content-Type", "application/json")
	response, err := client.Do(request)
	if err != nil {
		t.Fatalf("call malformed unauthenticated user event endpoint: %v", err)
	}
	body, err := io.ReadAll(io.LimitReader(response.Body, 8192))
	response.Body.Close()
	if err != nil {
		t.Fatalf("read malformed unauthenticated user event response: %v", err)
	}
	if response.StatusCode != http.StatusForbidden {
		t.Fatalf("malformed unauthenticated user event returned %d, want %d; body=%s", response.StatusCode, http.StatusForbidden, body)
	}

	request, err = http.NewRequest(
		http.MethodPost,
		fmt.Sprintf("http://127.0.0.1:%d/api/public/mailbox/user_event", server.GetListenedPort()),
		strings.NewReader(`{"username":"user@example.com","event_type":"unknown"}`),
	)
	if err != nil {
		t.Fatalf("create invalid user event request: %v", err)
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("X-JesusMail-Roundcube-SSO-Secret", "route-test-shared-secret")
	response, err = client.Do(request)
	if err != nil {
		t.Fatalf("call user event endpoint with invalid payload: %v", err)
	}
	defer response.Body.Close()
	body, err = io.ReadAll(io.LimitReader(response.Body, 8192))
	if err != nil {
		t.Fatalf("read invalid user event response: %v", err)
	}
	if response.StatusCode != http.StatusOK || !strings.Contains(string(body), `"success":false`) {
		t.Fatalf("invalid user event was not rejected safely: status=%d body=%s", response.StatusCode, body)
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
