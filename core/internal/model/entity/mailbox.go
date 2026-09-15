package entity

import "time"

// Mailbox defines the mailbox entity
type Mailbox struct {
	Username        string     `json:"username"        dc:"Email address"`
	Password        string     `json:"password"        dc:"Password"`
	PasswordEncode  string     `json:"password_encode" dc:"Encoded password"`
	FullName        string     `json:"full_name"       dc:"Full name"`
	IsAdmin         int        `json:"is_admin"        dc:"Is administrator: 1-yes, 0-no"`
	Maildir         string     `json:"maildir"         dc:"Mailbox directory"`
	Quota           int64      `json:"quota"           dc:"Mailbox quota"`
	LocalPart       string     `json:"local_part"      dc:"Local part (username)"`
	Domain          string     `json:"domain"          dc:"Domain name"`
	CreateTime      int64      `json:"create_time"     dc:"Creation time"`
	UpdateTime      int64      `json:"update_time"     dc:"Update time"`
	Active          int        `json:"active"            dc:"Status: 1-enabled, 0-disabled"`
	UsedQuota       int64      `json:"used_quota"        dc:"Used mailbox quota"`
	QuotaActive     int        `json:"quota_active"      dc:"Quota switch: 1-on, 0-off"`
	ExpiresAt       *time.Time `json:"expires_at"        dc:"Mailbox expiration time; null means permanent"`
	SourceType      string     `json:"source_type"       dc:"Mailbox creation source"`
	ActivationKeyID *int64     `json:"activation_key_id" dc:"Activation key relation"`
}
