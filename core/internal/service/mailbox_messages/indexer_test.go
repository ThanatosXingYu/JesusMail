package mailbox_messages

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestParseMessageExtractsSearchFields(t *testing.T) {
	root := t.TempDir()
	path := filepath.Join(root, "mail.qlu.edu.kg", "student", ".Sent", "cur", "1.eml")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	raw := strings.Join([]string{
		"From: Student <student@mail.qlu.edu.kg>",
		"To: One <one@example.com>, Two <two@example.com>",
		"Cc: three@example.com",
		"Subject: =?UTF-8?B?5rWL6K+V6YKu5Lu2?=",
		"Date: Tue, 27 Oct 2026 16:47:37 +0800",
		"Message-ID: <example@mail.qlu.edu.kg>",
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"Content-Transfer-Encoding: quoted-printable",
		"",
		"hello=20world",
	}, "\r\n")
	if err := os.WriteFile(path, []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}
	info, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}

	message, err := parseMessage(path, "mail.qlu.edu.kg", "student", ".Sent", info)
	if err != nil {
		t.Fatalf("parseMessage() error = %v", err)
	}
	if message.MailboxUsername != "student@mail.qlu.edu.kg" || message.Direction != "sent" {
		t.Fatalf("unexpected owner/direction: %+v", message)
	}
	if message.Sender != "student@mail.qlu.edu.kg" {
		t.Fatalf("sender = %q", message.Sender)
	}
	if message.Recipients != "one@example.com, two@example.com, three@example.com" {
		t.Fatalf("recipients = %q", message.Recipients)
	}
	if message.Subject != "测试邮件" || !strings.Contains(message.BodyText, "hello world") {
		t.Fatalf("subject/body not decoded: %+v", message)
	}
	if !message.SentAt.Equal(time.Date(2026, 10, 27, 8, 47, 37, 0, time.UTC)) {
		t.Fatalf("sent_at = %s", message.SentAt)
	}
}

func TestNormalizeAndTruncateSearchText(t *testing.T) {
	if got := normalizeText("  hello\n\n world\u0000 "); got != "hello world" {
		t.Fatalf("normalizeText() = %q", got)
	}
	if got := truncateRunes("你好世界", 2); got != "你好" {
		t.Fatalf("truncateRunes() = %q", got)
	}
}

func TestParseInboxMessageUsesReceivedDirection(t *testing.T) {
	root := t.TempDir()
	path := filepath.Join(root, "mail.qlu.edu.kg", "student", "cur", "2.eml")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	raw := "From: sender@example.com\r\nTo: student@mail.qlu.edu.kg\r\nSubject: Inbox\r\n\r\nhello"
	if err := os.WriteFile(path, []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}
	info, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	message, err := parseMessage(path, "mail.qlu.edu.kg", "student", "INBOX", info)
	if err != nil {
		t.Fatalf("parseMessage() error = %v", err)
	}
	if message.Direction != "received" || message.Folder != "INBOX" {
		t.Fatalf("unexpected inbox direction: %+v", message)
	}
}
