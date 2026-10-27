package mailbox_messages

import (
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"html"
	"io"
	"io/fs"
	"mime"
	"mime/multipart"
	"mime/quotedprintable"
	"net/mail"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
	"unicode/utf8"

	"jesusmail-core/internal/service/public"

	"github.com/gogf/gf/v2/frame/g"
	"golang.org/x/net/html/charset"
)

const (
	maxIndexedSourceBytes = 5 * 1024 * 1024
	maxSearchTextRunes    = 500_000
	previewRunes          = 320
)

var (
	ErrScanInProgress = errors.New("mail index scan is already running")
	scanMutex         sync.Mutex
	htmlTagPattern    = regexp.MustCompile(`(?s)<[^>]*>`)
	whitespacePattern = regexp.MustCompile(`\s+`)
)

type ScanResult struct {
	Scanned int `json:"scanned"`
	Indexed int `json:"indexed"`
	Removed int `json:"removed"`
	Failed  int `json:"failed"`
}

type indexedMessage struct {
	MailboxUsername string
	Direction       string
	Folder          string
	FilePath        string
	MessageID       string
	Sender          string
	Recipients      string
	Subject         string
	SentAt          time.Time
	BodyText        string
	BodyPreview     string
	SizeBytes       int64
	FileMtimeNS     int64
}

type existingFileState struct {
	FilePath    string
	FileMtimeNS int64
	SizeBytes   int64
}

// Scan indexes Maildir message metadata and text without modifying the source mail.
func Scan(ctx context.Context) (ScanResult, error) {
	if !scanMutex.TryLock() {
		return ScanResult{}, ErrScanInProgress
	}
	defer scanMutex.Unlock()

	root := public.AbsPath("../vmail-data")
	if _, err := os.Stat(root); err != nil {
		return ScanResult{}, fmt.Errorf("open mail data root: %w", err)
	}

	var states []existingFileState
	if err := g.DB().Model("mailbox_message_index").Ctx(ctx).
		Fields("file_path,file_mtime_ns,size_bytes").
		Scan(&states); err != nil {
		return ScanResult{}, fmt.Errorf("load existing mail index: %w", err)
	}
	existing := make(map[string]existingFileState, len(states))
	for _, state := range states {
		existing[state.FilePath] = state
	}

	var result ScanResult
	seen := make(map[string]struct{}, len(states))
	walkErr := filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			result.Failed++
			return nil
		}
		if err := ctx.Err(); err != nil {
			return err
		}

		relative, err := filepath.Rel(root, path)
		if err != nil {
			return nil
		}
		parts := splitPath(relative)
		if entry.IsDir() {
			if len(parts) == 1 && strings.HasPrefix(entry.Name(), ".") {
				return filepath.SkipDir
			}
			if entry.Name() == "tmp" || (len(parts) >= 3 && parts[2] == ".Drafts") {
				return filepath.SkipDir
			}
			return nil
		}
		if len(parts) < 4 {
			return nil
		}
		maildirSubdirIndex := len(parts) - 2
		if parts[maildirSubdirIndex] != "cur" && parts[maildirSubdirIndex] != "new" {
			return nil
		}
		folder := "INBOX"
		if len(parts) >= 5 {
			folder = parts[2]
		}
		if folder == ".Drafts" {
			return nil
		}

		seen[path] = struct{}{}
		result.Scanned++

		info, err := entry.Info()
		if err != nil {
			result.Failed++
			return nil
		}
		if state, ok := existing[path]; ok && state.FileMtimeNS == info.ModTime().UnixNano() && state.SizeBytes == info.Size() {
			return nil
		}

		message, err := parseMessage(path, parts[0], parts[1], folder, info)
		if err != nil {
			result.Failed++
			return nil
		}
		data := g.Map{
			"mailbox_username": message.MailboxUsername,
			"direction":        message.Direction,
			"folder":           message.Folder,
			"file_path":        message.FilePath,
			"message_id":       message.MessageID,
			"sender":           message.Sender,
			"recipients":       message.Recipients,
			"subject":          message.Subject,
			"sent_at":          message.SentAt,
			"body_text":        message.BodyText,
			"body_preview":     message.BodyPreview,
			"size_bytes":       message.SizeBytes,
			"file_mtime_ns":    message.FileMtimeNS,
			"updated_at":       time.Now().UTC(),
		}
		if _, err := g.DB().Model("mailbox_message_index").Ctx(ctx).
			Data(data).
			OnConflict("file_path").
			OnDuplicate(data).
			Insert(); err != nil {
			result.Failed++
			return nil
		}
		result.Indexed++
		return nil
	})
	if walkErr != nil {
		return result, walkErr
	}

	var indexed []struct {
		ID       int64  `orm:"id"`
		FilePath string `orm:"file_path"`
	}
	if err := g.DB().Model("mailbox_message_index").Ctx(ctx).
		Fields("id,file_path").
		Scan(&indexed); err != nil {
		return result, fmt.Errorf("list indexed mail files: %w", err)
	}
	staleIDs := make([]int64, 0)
	for _, item := range indexed {
		if _, ok := seen[item.FilePath]; !ok {
			staleIDs = append(staleIDs, item.ID)
		}
	}
	if len(staleIDs) > 0 {
		removed, err := g.DB().Model("mailbox_message_index").Ctx(ctx).
			WhereIn("id", staleIDs).
			Delete()
		if err != nil {
			return result, fmt.Errorf("remove stale mail index rows: %w", err)
		}
		affected, _ := removed.RowsAffected()
		result.Removed = int(affected)
	}
	return result, nil
}

func splitPath(path string) []string {
	cleaned := filepath.ToSlash(filepath.Clean(path))
	if cleaned == "." {
		return nil
	}
	return strings.Split(cleaned, "/")
}

func parseMessage(path, domain, localPart, folder string, info fs.FileInfo) (indexedMessage, error) {
	file, err := os.Open(path)
	if err != nil {
		return indexedMessage{}, err
	}
	defer file.Close()

	reader := io.LimitReader(file, maxIndexedSourceBytes)
	parsed, err := mail.ReadMessage(reader)
	if err != nil {
		return indexedMessage{}, err
	}
	body, err := extractMessageText(parsed.Header, parsed.Body)
	if err != nil {
		return indexedMessage{}, err
	}
	body = normalizeText(body)
	body = truncateRunes(body, maxSearchTextRunes)
	preview := truncateRunes(body, previewRunes)

	direction := "received"
	if strings.EqualFold(folder, ".Sent") || strings.EqualFold(folder, "Sent") {
		direction = "sent"
	}
	sentAt := info.ModTime()
	if date, err := mail.ParseDate(parsed.Header.Get("Date")); err == nil {
		sentAt = date
	}
	return indexedMessage{
		MailboxUsername: strings.ToLower(localPart + "@" + domain),
		Direction:       direction,
		Folder:          folder,
		FilePath:        path,
		MessageID:       strings.TrimSpace(parsed.Header.Get("Message-Id")),
		Sender:          formatAddressHeader(parsed.Header.Get("From")),
		Recipients:      formatRecipients(parsed.Header, "To", "Cc"),
		Subject:         decodeHeader(parsed.Header.Get("Subject")),
		SentAt:          sentAt,
		BodyText:        body,
		BodyPreview:     preview,
		SizeBytes:       info.Size(),
		FileMtimeNS:     info.ModTime().UnixNano(),
	}, nil
}

func formatRecipients(header mail.Header, names ...string) string {
	values := make([]string, 0)
	for _, name := range names {
		for _, value := range headerValues(header, name) {
			addresses, err := mail.ParseAddressList(value)
			if err != nil {
				if trimmed := strings.TrimSpace(value); trimmed != "" {
					values = append(values, trimmed)
				}
				continue
			}
			for _, address := range addresses {
				values = append(values, strings.ToLower(address.Address))
			}
		}
	}
	return strings.Join(uniqueStrings(values), ", ")
}

func headerValues(header mail.Header, name string) []string {
	for key, values := range header {
		if strings.EqualFold(key, name) {
			return values
		}
	}
	return nil
}

func formatAddressHeader(value string) string {
	addresses, err := mail.ParseAddressList(value)
	if err != nil {
		return decodeHeader(value)
	}
	result := make([]string, 0, len(addresses))
	for _, address := range addresses {
		result = append(result, strings.ToLower(address.Address))
	}
	return strings.Join(uniqueStrings(result), ", ")
}

func uniqueStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		key := strings.ToLower(value)
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, value)
	}
	return result
}

func decodeHeader(value string) string {
	decoded, err := new(mime.WordDecoder).DecodeHeader(value)
	if err != nil {
		return strings.TrimSpace(value)
	}
	return strings.TrimSpace(decoded)
}

func extractMessageText(header mail.Header, body io.Reader) (string, error) {
	contentType := header.Get("Content-Type")
	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		mediaType = "text/plain"
		params = map[string]string{}
	}
	if strings.HasPrefix(mediaType, "multipart/") {
		boundary := params["boundary"]
		if boundary == "" {
			return "", errors.New("multipart message has no boundary")
		}
		reader := multipart.NewReader(body, boundary)
		plain := make([]string, 0)
		fallback := make([]string, 0)
		for {
			part, err := reader.NextPart()
			if errors.Is(err, io.EOF) {
				break
			}
			if err != nil {
				return "", err
			}
			partHeader := mail.Header(part.Header)
			disposition, _, _ := mime.ParseMediaType(partHeader.Get("Content-Disposition"))
			if strings.EqualFold(disposition, "attachment") {
				continue
			}
			text, err := extractMessageText(partHeader, part)
			if err != nil || strings.TrimSpace(text) == "" {
				continue
			}
			if strings.HasPrefix(strings.ToLower(partHeader.Get("Content-Type")), "text/plain") {
				plain = append(plain, text)
			} else {
				fallback = append(fallback, text)
			}
		}
		if len(plain) > 0 {
			return strings.Join(plain, "\n"), nil
		}
		return strings.Join(fallback, "\n"), nil
	}

	raw, err := io.ReadAll(io.LimitReader(body, maxIndexedSourceBytes))
	if err != nil {
		return "", err
	}
	switch strings.ToLower(strings.TrimSpace(header.Get("Content-Transfer-Encoding"))) {
	case "base64":
		decoded := make([]byte, base64.StdEncoding.DecodedLen(len(raw)))
		n, decodeErr := base64.StdEncoding.Decode(decoded, raw)
		if decodeErr == nil {
			raw = decoded[:n]
		}
	case "quoted-printable":
		if decoded, decodeErr := io.ReadAll(quotedprintable.NewReader(bytes.NewReader(raw))); decodeErr == nil {
			raw = decoded
		}
	}

	encoding := params["charset"]
	if encoding == "" {
		encoding = "utf-8"
	}
	if converted, err := charset.NewReader(bytes.NewReader(raw), encoding); err == nil {
		if decoded, readErr := io.ReadAll(converted); readErr == nil {
			raw = decoded
		}
	}
	text := string(raw)
	if strings.EqualFold(mediaType, "text/html") {
		text = html.UnescapeString(htmlTagPattern.ReplaceAllString(text, " "))
	}
	return text, nil
}

func normalizeText(value string) string {
	value = strings.ReplaceAll(value, "\u0000", " ")
	return strings.TrimSpace(whitespacePattern.ReplaceAllString(value, " "))
}

func truncateRunes(value string, limit int) string {
	if limit <= 0 || utf8.RuneCountInString(value) <= limit {
		return value
	}
	runes := []rune(value)
	return string(runes[:limit])
}
