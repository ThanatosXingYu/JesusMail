package operation_log

import (
	"context"
	"errors"
	"strings"

	"jesusmail-core/internal/model/entity"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

const (
	maxUserLogPageSize = 100

	userLogTypeLogin   = "login"
	userLogTypeLogout  = "logout"
	userLogTypeSend    = "send"
	userLogTypeReceive = "receive"
)

var ErrInvalidUserLogFilter = errors.New("invalid mailbox user log filter")

type UserLogFilter struct {
	Page      int
	PageSize  int
	Username  string
	EventType string
	Keyword   string
	StartTime int64
	EndTime   int64
}

// ListUserLogs merges webmail activity with existing mail statistics. Each source
// keeps its own unique key, and only fields needed by the admin table are returned.
func ListUserLogs(ctx context.Context, filter UserLogFilter) (int, []entity.MailboxUserLog, error) {
	filter, eventTypes, err := normalizeUserLogFilter(filter)
	if err != nil {
		return 0, nil, err
	}

	branches := make([]*gdb.Model, 0, 3)
	if containsUserLogType(eventTypes, userLogTypeLogin) || containsUserLogType(eventTypes, userLogTypeLogout) {
		branches = append(branches, userEventBranch(ctx, filter, eventTypes))
	}
	if containsUserLogType(eventTypes, userLogTypeSend) {
		branches = append(branches, userSendBranch(ctx, filter))
	}
	if containsUserLogType(eventTypes, userLogTypeReceive) {
		branches = append(branches, userReceiveBranch(ctx, filter))
	}

	query := branches[0].UnionAll(branches...).Ctx(ctx)
	total, err := query.Count()
	if err != nil {
		return 0, nil, err
	}

	list := make([]entity.MailboxUserLog, 0)
	err = query.OrderDesc("time").
		OrderDesc("id").
		Page(filter.Page, filter.PageSize).
		Scan(&list)
	if err != nil {
		return 0, nil, err
	}
	return total, list, nil
}

func normalizeUserLogFilter(filter UserLogFilter) (UserLogFilter, []string, error) {
	filter.Username = strings.TrimSpace(filter.Username)
	filter.Keyword = strings.TrimSpace(filter.Keyword)
	filter.EventType = strings.ToLower(strings.TrimSpace(filter.EventType))
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PageSize < 1 {
		filter.PageSize = 20
	}
	if filter.PageSize > maxUserLogPageSize {
		filter.PageSize = maxUserLogPageSize
	}
	if filter.StartTime < 0 || filter.EndTime < 0 ||
		(filter.StartTime > 0 && filter.EndTime > 0 && filter.StartTime > filter.EndTime) {
		return UserLogFilter{}, nil, ErrInvalidUserLogFilter
	}

	eventTypes, ok := selectedUserLogEventTypes(filter.EventType)
	if !ok {
		return UserLogFilter{}, nil, ErrInvalidUserLogFilter
	}
	return filter, eventTypes, nil
}

func selectedUserLogEventTypes(eventType string) ([]string, bool) {
	switch eventType {
	case "", "all":
		return []string{userLogTypeLogin, userLogTypeLogout, userLogTypeSend, userLogTypeReceive}, true
	case userLogTypeLogin, userLogTypeLogout, userLogTypeSend, userLogTypeReceive:
		return []string{eventType}, true
	default:
		return nil, false
	}
}

func containsUserLogType(eventTypes []string, target string) bool {
	for _, eventType := range eventTypes {
		if eventType == target {
			return true
		}
	}
	return false
}

func userEventBranch(ctx context.Context, filter UserLogFilter, eventTypes []string) *gdb.Model {
	model := gdbModel(ctx, "mailbox_user_events e").
		Fields(
			"('user-event:' || e.id) AS id",
			"LOWER(e.username) AS username",
			"e.event_type AS event_type",
			"CASE e.event_type WHEN 'login' THEN '邮箱登录' ELSE '邮箱退出' END AS event",
			"'success' AS status",
			"COALESCE(NULLIF(e.ip, ''), 'unknown') AS ip",
			"COALESCE(e.user_agent, '') AS user_agent",
			"COALESCE(e.detail, '') AS detail",
			"EXTRACT(EPOCH FROM e.created_at)::BIGINT AS time",
		)
	if len(eventTypes) == 1 && (eventTypes[0] == userLogTypeLogin || eventTypes[0] == userLogTypeLogout) {
		model = model.Where("e.event_type", eventTypes[0])
	}
	if filter.Username != "" {
		model = model.Where("LOWER(e.username) LIKE ?", "%"+strings.ToLower(filter.Username)+"%")
	}
	if filter.Keyword != "" {
		keyword := "%" + strings.ToLower(filter.Keyword) + "%"
		model = model.Where(
			"(LOWER(e.username) LIKE ? OR LOWER(e.ip) LIKE ? OR LOWER(e.user_agent) LIKE ? OR LOWER(e.detail) LIKE ?)",
			keyword, keyword, keyword, keyword,
		)
	}
	if filter.StartTime > 0 {
		model = model.Where("e.created_at >= to_timestamp(?)", filter.StartTime)
	}
	if filter.EndTime > 0 {
		model = model.Where("e.created_at <= to_timestamp(?)", filter.EndTime)
	}
	return model
}

func userSendBranch(ctx context.Context, filter UserLogFilter) *gdb.Model {
	model := gdbModel(ctx, "mailstat_send_mails sm").
		InnerJoin("mailstat_senders s", "sm.postfix_message_id = s.postfix_message_id").
		InnerJoin("mailbox mb", "LOWER(mb.username) = LOWER(s.sender)").
		Fields(
			"('send:' || sm.postfix_message_id) AS id",
			"LOWER(s.sender) AS username",
			"'send' AS event_type",
			"'发送邮件' AS event",
			"COALESCE(NULLIF(sm.status, ''), 'unknown') AS status",
			"'' AS ip",
			"'' AS user_agent",
			"COALESCE(sm.recipient, '') AS detail",
			"COALESCE(sm.log_time, 0)::BIGINT AS time",
		)
	return applyMailLogFilters(model, "s.sender", "sm.status", "sm.recipient", filter, "sm.log_time")
}

func userReceiveBranch(ctx context.Context, filter UserLogFilter) *gdb.Model {
	model := gdbModel(ctx, "mailstat_receive_mails rm").
		InnerJoin("mailbox mb", "LOWER(mb.username) = LOWER(rm.recipient)").
		LeftJoin("mailstat_senders snd", "snd.postfix_message_id = rm.postfix_message_id").
		Fields(
			"('receive:' || rm.postfix_message_id) AS id",
			"LOWER(rm.recipient) AS username",
			"'receive' AS event_type",
			"'接收邮件' AS event",
			"COALESCE(NULLIF(rm.status, ''), 'unknown') AS status",
			"'' AS ip",
			"'' AS user_agent",
			"COALESCE(snd.sender, '') AS detail",
			"COALESCE(rm.log_time, 0)::BIGINT AS time",
		)
	return applyMailLogFilters(model, "rm.recipient", "rm.status", "snd.sender", filter, "rm.log_time")
}

func applyMailLogFilters(model *gdb.Model, usernameColumn, statusColumn, detailColumn string, filter UserLogFilter, timeColumn string) *gdb.Model {
	if filter.Username != "" {
		model = model.Where("LOWER("+usernameColumn+") LIKE ?", "%"+strings.ToLower(filter.Username)+"%")
	}
	if filter.Keyword != "" {
		keyword := "%" + strings.ToLower(filter.Keyword) + "%"
		model = model.Where(
			"(LOWER("+usernameColumn+") LIKE ? OR LOWER("+statusColumn+") LIKE ? OR LOWER(COALESCE("+detailColumn+", '')) LIKE ?)",
			keyword, keyword, keyword,
		)
	}
	if filter.StartTime > 0 {
		model = model.Where(timeColumn+" >= ?", filter.StartTime)
	}
	if filter.EndTime > 0 {
		model = model.Where(timeColumn+" <= ?", filter.EndTime)
	}
	return model
}

func gdbModel(ctx context.Context, table string) *gdb.Model {
	return g.DB().Model(table).Ctx(ctx).Safe()
}
