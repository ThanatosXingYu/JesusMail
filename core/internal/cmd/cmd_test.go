package cmd

import "testing"

func TestIsPublicActivationPath(t *testing.T) {
	tests := []struct {
		path string
		want bool
	}{
		{path: "/activate", want: true},
		{path: "/activate/", want: true},
		{path: "/api/public/activation/activate", want: true},
		{path: "/static/js/index.js", want: true},
		{path: "/api/activation/list", want: false},
		{path: "/mailbox", want: false},
		{path: "/activate/extra", want: false},
		{path: "/api/public/activation/activate/extra", want: false},
	}

	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			if got := isPublicActivationPath(tt.path); got != tt.want {
				t.Fatalf("isPublicActivationPath(%q) = %v, want %v", tt.path, got, tt.want)
			}
		})
	}
}
