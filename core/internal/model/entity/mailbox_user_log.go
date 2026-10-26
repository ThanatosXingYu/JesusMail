package entity

type MailboxUserLog struct {
	ID        string `json:"id"         db:"id"`
	Username  string `json:"username"   db:"username"`
	EventType string `json:"event_type" db:"event_type"`
	Event     string `json:"event"      db:"event"`
	Status    string `json:"status"     db:"status"`
	IP        string `json:"ip"         db:"ip"`
	UserAgent string `json:"user_agent" db:"user_agent"`
	Detail    string `json:"detail"     db:"detail"`
	Time      int64  `json:"time"       db:"time"`
}
