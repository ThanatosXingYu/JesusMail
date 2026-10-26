package operation_log

import (
	"errors"
	"reflect"
	"testing"
)

func TestSelectedUserLogEventTypes(t *testing.T) {
	tests := []struct {
		eventType string
		want      []string
		wantOK    bool
	}{
		{eventType: "", want: []string{"login", "logout", "send", "receive"}, wantOK: true},
		{eventType: "all", want: []string{"login", "logout", "send", "receive"}, wantOK: true},
		{eventType: "login", want: []string{"login"}, wantOK: true},
		{eventType: "logout", want: []string{"logout"}, wantOK: true},
		{eventType: "send", want: []string{"send"}, wantOK: true},
		{eventType: "receive", want: []string{"receive"}, wantOK: true},
		{eventType: "password", wantOK: false},
	}

	for _, tt := range tests {
		t.Run(tt.eventType, func(t *testing.T) {
			got, ok := selectedUserLogEventTypes(tt.eventType)
			if ok != tt.wantOK {
				t.Fatalf("ok = %v, want %v", ok, tt.wantOK)
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Fatalf("event types = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestNormalizeUserLogFilter(t *testing.T) {
	filter, eventTypes, err := normalizeUserLogFilter(UserLogFilter{
		Page:      0,
		PageSize:  500,
		Username:  " user@example.com ",
		EventType: " LOGIN ",
		Keyword:   " webmail ",
		StartTime: 100,
		EndTime:   200,
	})
	if err != nil {
		t.Fatalf("normalize filter: %v", err)
	}

	if filter.Page != 1 || filter.PageSize != maxUserLogPageSize {
		t.Fatalf("pagination = %d/%d, want 1/%d", filter.Page, filter.PageSize, maxUserLogPageSize)
	}
	if filter.Username != "user@example.com" || filter.EventType != "login" || filter.Keyword != "webmail" {
		t.Fatalf("filter was not normalized: %+v", filter)
	}
	if !reflect.DeepEqual(eventTypes, []string{"login"}) {
		t.Fatalf("event types = %v, want login only", eventTypes)
	}
}

func TestNormalizeUserLogFilterRejectsInvalidRange(t *testing.T) {
	_, _, err := normalizeUserLogFilter(UserLogFilter{
		Page:      1,
		PageSize:  20,
		StartTime: 200,
		EndTime:   100,
	})
	if !errors.Is(err, ErrInvalidUserLogFilter) {
		t.Fatalf("normalize error = %v, want ErrInvalidUserLogFilter", err)
	}
}
