package mailbox_messages

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/gogf/gf/v2/frame/g"
)

const maxPageSize = 100

var ErrInvalidFilter = errors.New("invalid mail message filter")

type Message struct {
	ID              int64     `json:"id"`
	MailboxUsername string    `json:"mailbox_username"`
	Direction       string    `json:"direction"`
	Folder          string    `json:"folder"`
	MessageID       string    `json:"message_id"`
	Sender          string    `json:"sender"`
	Recipients      string    `json:"recipients"`
	Subject         string    `json:"subject"`
	SentAt          time.Time `json:"sent_at"`
	BodyPreview     string    `json:"body_preview"`
}

type Filter struct {
	Page      int
	PageSize  int
	Direction string
	Keyword   string
	Mailbox   string
	StartTime int64
	EndTime   int64
}

func List(ctx context.Context, filter Filter) (int, []Message, error) {
	filter.Direction = strings.ToLower(strings.TrimSpace(filter.Direction))
	if filter.Direction != "sent" && filter.Direction != "received" {
		return 0, nil, ErrInvalidFilter
	}
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PageSize < 1 {
		filter.PageSize = 20
	}
	if filter.PageSize > maxPageSize {
		filter.PageSize = maxPageSize
	}
	if filter.StartTime < 0 || filter.EndTime < 0 ||
		(filter.StartTime > 0 && filter.EndTime > 0 && filter.StartTime > filter.EndTime) {
		return 0, nil, ErrInvalidFilter
	}

	query := g.DB().Model("mailbox_message_index").Ctx(ctx).
		Where("direction", filter.Direction)
	if mailbox := strings.ToLower(strings.TrimSpace(filter.Mailbox)); mailbox != "" {
		query = query.WhereLike("mailbox_username", "%"+mailbox+"%")
	}
	if keyword := strings.TrimSpace(filter.Keyword); keyword != "" {
		pattern := "%" + strings.ToLower(keyword) + "%"
		query = query.Where(
			"(LOWER(mailbox_username) LIKE ? OR LOWER(sender) LIKE ? OR LOWER(recipients) LIKE ? OR LOWER(subject) LIKE ? OR LOWER(body_text) LIKE ?)",
			pattern, pattern, pattern, pattern, pattern,
		)
	}
	if filter.StartTime > 0 {
		query = query.WhereGTE("sent_at", time.Unix(filter.StartTime, 0))
	}
	if filter.EndTime > 0 {
		query = query.WhereLTE("sent_at", time.Unix(filter.EndTime, 0))
	}

	total, err := query.Count()
	if err != nil {
		return 0, nil, err
	}
	list := make([]Message, 0)
	err = query.Fields(
		"id,mailbox_username,direction,folder,message_id,sender,recipients,subject,sent_at,body_preview",
	).OrderDesc("sent_at").OrderDesc("id").Page(filter.Page, filter.PageSize).Scan(&list)
	return total, list, err
}
