package public_activation

import "testing"

func TestResolveActivationClientIP(t *testing.T) {
	tests := []struct {
		name         string
		remote       string
		realIP       string
		forwardedFor string
		want         string
	}{
		{
			name:         "public peer cannot spoof forwarding headers",
			remote:       "198.51.100.10",
			realIP:       "203.0.113.20",
			forwardedFor: "203.0.113.21",
			want:         "198.51.100.10",
		},
		{
			name:   "loopback proxy can provide real ip",
			remote: "127.0.0.1",
			realIP: "203.0.113.20",
			want:   "203.0.113.20",
		},
		{
			name:         "private proxy uses nearest forwarded address",
			remote:       "172.18.0.2",
			forwardedFor: "192.0.2.1, 203.0.113.20",
			want:         "203.0.113.20",
		},
		{
			name:         "invalid forwarding data falls back to proxy",
			remote:       "172.18.0.2",
			realIP:       "not-an-ip",
			forwardedFor: "also-invalid",
			want:         "172.18.0.2",
		},
		{
			name:   "invalid remote is unknown",
			remote: "not-an-ip",
			want:   "unknown",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := resolveActivationClientIP(tt.remote, tt.realIP, tt.forwardedFor); got != tt.want {
				t.Fatalf("resolveActivationClientIP() = %q, want %q", got, tt.want)
			}
		})
	}
}
