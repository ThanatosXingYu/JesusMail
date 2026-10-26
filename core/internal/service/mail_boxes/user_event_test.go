package mail_boxes

import (
	"context"
	"errors"
	"strings"
	"testing"
)

type fakeMailboxUserEventRepository struct {
	events []MailboxUserEvent
	err    error
}

func (r *fakeMailboxUserEventRepository) Insert(_ context.Context, event MailboxUserEvent) error {
	r.events = append(r.events, event)
	return r.err
}

func TestMailboxUserEventServiceRecordsSanitizedEvent(t *testing.T) {
	repository := &fakeMailboxUserEventRepository{}
	service := &mailboxUserEventService{repository: repository}

	err := service.record(context.Background(), MailboxUserEvent{
		Username:  "  USER@Example.com ",
		EventType: " LOGIN ",
		IP:        " ",
		UserAgent: " Test Browser ",
		Detail:    " Roundcube webmail ",
	})
	if err != nil {
		t.Fatalf("record event: %v", err)
	}
	if len(repository.events) != 1 {
		t.Fatalf("recorded %d events, want 1", len(repository.events))
	}

	event := repository.events[0]
	if event.Username != "user@example.com" {
		t.Fatalf("username = %q, want normalized username", event.Username)
	}
	if event.EventType != MailboxUserEventLogin {
		t.Fatalf("event type = %q, want %q", event.EventType, MailboxUserEventLogin)
	}
	if event.IP != "unknown" {
		t.Fatalf("ip = %q, want unknown fallback", event.IP)
	}
	if event.UserAgent != "Test Browser" || event.Detail != "Roundcube webmail" {
		t.Fatalf("event metadata was not trimmed: %+v", event)
	}
}

func TestMailboxUserEventServiceRejectsInvalidInput(t *testing.T) {
	tests := []struct {
		name  string
		event MailboxUserEvent
	}{
		{
			name:  "invalid username",
			event: MailboxUserEvent{Username: "not-an-email", EventType: MailboxUserEventLogin},
		},
		{
			name:  "unsupported event",
			event: MailboxUserEvent{Username: "user@example.com", EventType: "password"},
		},
		{
			name: "oversized user agent",
			event: MailboxUserEvent{
				Username:  "user@example.com",
				EventType: MailboxUserEventLogin,
				UserAgent: strings.Repeat("a", 513),
			},
		},
		{
			name: "oversized detail",
			event: MailboxUserEvent{
				Username:  "user@example.com",
				EventType: MailboxUserEventLogout,
				Detail:    strings.Repeat("a", 513),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := &fakeMailboxUserEventRepository{}
			service := &mailboxUserEventService{repository: repository}

			err := service.record(context.Background(), tt.event)
			if !errors.Is(err, ErrInvalidMailboxUserEvent) {
				t.Fatalf("record error = %v, want ErrInvalidMailboxUserEvent", err)
			}
			if len(repository.events) != 0 {
				t.Fatalf("invalid event reached repository: %+v", repository.events)
			}
		})
	}
}
