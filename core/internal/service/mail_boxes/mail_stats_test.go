package mail_boxes

import (
	"context"
	"testing"
)

func TestGetMailStatsEmptyPage(t *testing.T) {
	for _, usernames := range [][]string{nil, {}} {
		stats, err := GetMailStats(context.Background(), usernames)
		if err != nil {
			t.Fatal(err)
		}
		if stats == nil || len(stats) != 0 {
			t.Fatalf("empty page: got %#v", stats)
		}
	}
}
