package mail_boxes

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/gogf/gf/v2/frame/g"
)

const (
	MailboxUserEventLogin  = "login"
	MailboxUserEventLogout = "logout"
)

var ErrInvalidMailboxUserEvent = errors.New("invalid mailbox user event")

type MailboxUserEvent struct {
	Username  string
	EventType string
	IP        string
	UserAgent string
	Detail    string
}

type mailboxUserEventRepository interface {
	Insert(ctx context.Context, event MailboxUserEvent) error
}

type databaseMailboxUserEventRepository struct{}

func (databaseMailboxUserEventRepository) Insert(ctx context.Context, event MailboxUserEvent) error {
	_, err := g.DB().Model("mailbox_user_events").Ctx(ctx).Data(g.Map{
		"username":   event.Username,
		"event_type": event.EventType,
		"ip":         event.IP,
		"user_agent": event.UserAgent,
		"detail":     event.Detail,
		"created_at": time.Now().UTC(),
	}).Insert()
	return err
}

type mailboxUserEventService struct {
	repository mailboxUserEventRepository
}

func defaultMailboxUserEventService() *mailboxUserEventService {
	return &mailboxUserEventService{repository: databaseMailboxUserEventRepository{}}
}

// RecordMailboxUserEvent stores successful Roundcube login/logout events without
// accepting passwords, message bodies, tickets, or arbitrary metadata.
func RecordMailboxUserEvent(ctx context.Context, event MailboxUserEvent) error {
	return defaultMailboxUserEventService().record(ctx, event)
}

func (s *mailboxUserEventService) record(ctx context.Context, event MailboxUserEvent) error {
	event.Username = normalizeLoginTicketUsername(event.Username)
	event.EventType = strings.ToLower(strings.TrimSpace(event.EventType))
	event.IP = strings.TrimSpace(event.IP)
	event.UserAgent = strings.TrimSpace(event.UserAgent)
	event.Detail = strings.TrimSpace(event.Detail)

	if event.Username == "" ||
		(event.EventType != MailboxUserEventLogin && event.EventType != MailboxUserEventLogout) ||
		len(event.IP) > 64 ||
		len(event.UserAgent) > 512 ||
		len(event.Detail) > 512 {
		return ErrInvalidMailboxUserEvent
	}
	if event.IP == "" {
		event.IP = "unknown"
	}

	if err := s.repository.Insert(ctx, event); err != nil {
		return err
	}
	return nil
}
